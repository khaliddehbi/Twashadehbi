import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { PRODUCTS } from '../data/products';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const {
    products,
    setProducts,
    addNewProduct,
    updateProduct,
    deleteProduct
  } = useStore();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_orders') || localStorage.getItem('twasha_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState(CUSTOMER_REVIEWS);

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_coupons') || localStorage.getItem('twasha_coupons');
      return saved ? JSON.parse(saved) : [
        { code: 'TWISHIYAT10', type: 'percentage', value: 10, uses: 142, active: true },
        { code: 'MAROC', type: 'shipping', value: 0, uses: 89, active: true },
        { code: 'VIP20', type: 'percentage', value: 20, uses: 34, active: true }
      ];
    } catch (e) {
      return [
        { code: 'TWISHIYAT10', type: 'percentage', value: 10, uses: 142, active: true },
        { code: 'MAROC', type: 'shipping', value: 0, uses: 89, active: true },
        { code: 'VIP20', type: 'percentage', value: 20, uses: 34, active: true }
      ];
    }
  });

  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // 1. Fetch Orders from Supabase on mount
  useEffect(() => {
    const fetchSupabaseOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            date: item.created_at,
            customer: {
              fullName: item.customer_name,
              phone: item.customer_phone,
              city: item.city,
              address: item.address,
              neighborhood: item.neighborhood || '',
              notes: item.notes || ''
            },
            items: typeof item.items === 'string' ? JSON.parse(item.items) : (item.items || []),
            subtotal: Number(item.subtotal) || Number(item.total),
            deliveryFee: Number(item.delivery_fee) || 0,
            discount: Number(item.discount) || 0,
            total: Number(item.total),
            paymentMethod: item.payment_method || 'cod',
            status: item.status || 'pending_confirmation',
            statusLabel: item.status_label || 'En attente de confirmation',
            carrier: item.carrier || 'Amana / Cathedis Express',
            timeline: typeof item.timeline === 'string' ? JSON.parse(item.timeline) : (item.timeline || [])
          }));

          setOrders(mapped);
          setSupabaseConnected(true);
        } else if (!error) {
          setSupabaseConnected(true);
        }
      } catch (err) {
        console.warn('Supabase initial fetch info:', err);
      }
    };

    fetchSupabaseOrders();

    // 2. Realtime WebSocket subscription for live incoming orders
    try {
      const channel = supabase
        .channel('orders-realtime-feed')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            const newRow = payload.new;
            const formatted = {
              id: newRow.id,
              date: newRow.created_at,
              customer: {
                fullName: newRow.customer_name,
                phone: newRow.customer_phone,
                city: newRow.city,
                address: newRow.address,
                neighborhood: newRow.neighborhood || '',
                notes: newRow.notes || ''
              },
              items: typeof newRow.items === 'string' ? JSON.parse(newRow.items) : (newRow.items || []),
              subtotal: Number(newRow.subtotal) || Number(newRow.total),
              deliveryFee: Number(newRow.delivery_fee) || 0,
              discount: Number(newRow.discount) || 0,
              total: Number(newRow.total),
              paymentMethod: newRow.payment_method || 'cod',
              status: newRow.status,
              statusLabel: newRow.status_label,
              carrier: newRow.carrier,
              timeline: typeof newRow.timeline === 'string' ? JSON.parse(newRow.timeline) : (newRow.timeline || [])
            };

            setOrders((prev) => {
              if (prev.some((o) => o.id === formatted.id)) return prev;
              return [formatted, ...prev];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription fallback:', err);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twishiyat_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);



  useEffect(() => {
    try {
      localStorage.setItem('twishiyat_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  // Coupon Management Helpers
  const addCoupon = (newCoupon) => {
    setCoupons((prev) => {
      const codeClean = newCoupon.code.trim().toUpperCase();
      const existing = prev.filter((c) => c.code.toUpperCase() !== codeClean);
      const updated = [
        {
          code: codeClean,
          type: newCoupon.type || 'percentage',
          value: Number(newCoupon.value) || 10,
          uses: 0,
          active: true
        },
        ...existing
      ];
      try {
        localStorage.setItem('twishiyat_coupons', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) => {
      const updated = prev.map((c) =>
        c.code.toUpperCase() === code.toUpperCase() ? { ...c, active: !c.active } : c
      );
      try {
        localStorage.setItem('twishiyat_coupons', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
      try {
        localStorage.setItem('twishiyat_coupons', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Insert Order to Supabase and Local state + Auto Decrement Stock
  const addOrder = async (newOrder) => {
    // 1. Update local state immediately for instant feedback
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Automatically decrement stock of ordered items in storefront
    try {
      if (Array.isArray(newOrder.items)) {
        newOrder.items.forEach((item) => {
          const pId = item.productId || item.id;
          if (pId) {
            const currentProd = products.find((p) => p.id === pId);
            if (currentProd && typeof currentProd.stock === 'number') {
              const newStock = Math.max(0, currentProd.stock - (item.quantity || 1));
              updateProduct(pId, { stock: newStock });
            }
          }
        });
      }
    } catch (err) {
      console.warn('Auto stock reduction notice:', err);
    }

    // 3. Sync to Supabase Cloud
    try {
      await supabase.from('orders').insert([
        {
          id: newOrder.id,
          created_at: newOrder.date,
          customer_name: newOrder.customer.fullName,
          customer_phone: newOrder.customer.phone,
          city: newOrder.customer.city,
          address: newOrder.customer.address,
          neighborhood: newOrder.customer.neighborhood || '',
          notes: newOrder.customer.notes || '',
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          discount: newOrder.discount || 0,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status,
          status_label: newOrder.statusLabel,
          carrier: newOrder.carrier,
          timeline: newOrder.timeline
        }
      ]);
      setSupabaseConnected(true);
    } catch (err) {
      console.warn('Supabase order insert notice:', err);
    }
  };

  // Update order status in Supabase, Local state, and Client Space
  const updateOrderStatus = async (orderId, newStatus) => {
    const nowStr = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    let statusLabel = '';
    if (newStatus === 'confirmed') statusLabel = 'Confirmée par WhatsApp / Appel';
    else if (newStatus === 'processing') statusLabel = 'En préparation soignée en atelier';
    else if (newStatus === 'shipped') statusLabel = 'Expédiée avec Transporteur Express';
    else if (newStatus === 'out_for_delivery') statusLabel = 'En cours de livraison avec coursier';
    else if (newStatus === 'delivered') statusLabel = 'Livrée & Encaissée';
    else if (newStatus === 'cancelled') statusLabel = 'Annulée / Refusée';
    else statusLabel = 'En attente de confirmation';

    const stageHierarchy = ['pending_confirmation', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentLevel = stageHierarchy.indexOf(newStatus);

    let updatedTimeline = [];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const rawTimeline = (ord.timeline && ord.timeline.length > 0) ? ord.timeline : [
            { status: 'received', title: 'Commande Enregistrée', date: 'Enregistrée', completed: true, current: false },
            { status: 'confirmed', title: 'Confirmation WhatsApp / Appel', date: 'Sous 15 min', completed: false, current: false },
            { status: 'processing', title: 'Préparation soignée en atelier TWISHIYAT', date: 'Même jour', completed: false, current: false },
            { status: 'shipped', title: `Expédition Express (${ord.customer?.city || 'Maroc'})`, date: '24h-48h', completed: false, current: false },
            { status: 'out_for_delivery', title: 'Remise au coursier pour livraison', date: 'Jour J', completed: false, current: false },
            { status: 'delivered', title: 'Livraison & Paiement espèces au livreur', date: 'Finalisée', completed: false, current: false }
          ];

          updatedTimeline = rawTimeline.map((step) => {
            const stepKey = step.status === 'received' ? 'pending_confirmation' : step.status;
            const stepLevel = stageHierarchy.indexOf(stepKey);

            if (newStatus === 'cancelled') {
              return { ...step, current: false };
            }

            const isDone = newStatus === 'delivered' ? true : (stepLevel <= currentLevel);
            const isCurr = (stepKey === newStatus) || (newStatus === 'pending_confirmation' && step.status === 'received');

            return {
              ...step,
              completed: isDone,
              current: isCurr,
              date: isCurr ? nowStr : (isDone ? step.date : step.date)
            };
          });

          return {
            ...ord,
            status: newStatus,
            statusLabel,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );

    // 1. Sync to Client Local Storage (twishiyat_my_orders) for instant Mon Compte reflection
    try {
      const myOrdersRaw = localStorage.getItem('twishiyat_my_orders');
      if (myOrdersRaw) {
        const myOrders = JSON.parse(myOrdersRaw);
        const updatedMyOrders = myOrders.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              status: newStatus,
              statusLabel,
              timeline: updatedTimeline.length > 0 ? updatedTimeline : ord.timeline
            };
          }
          return ord;
        });
        localStorage.setItem('twishiyat_my_orders', JSON.stringify(updatedMyOrders));
      }
    } catch (e) {
      console.warn('Sync to twishiyat_my_orders error:', e);
    }

    // 2. Dispatch cross-component event for instant UI update in open views (AccountView, TrackingView)
    try {
      window.dispatchEvent(
        new CustomEvent('twishiyat_order_updated', {
          detail: { orderId, newStatus, statusLabel, timeline: updatedTimeline }
        })
      );
    } catch (e) {}

    // 3. Sync to Supabase Cloud
    try {
      await supabase
        .from('orders')
        .update({
          status: newStatus,
          status_label: statusLabel,
          timeline: updatedTimeline
        })
        .eq('id', orderId);
    } catch (err) {
      console.warn('Supabase status update notice:', err);
    }
  };

  // KPIs Calculations
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
  const confirmedOrDeliveredCount = orders.filter((o) =>
    ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(o.status)
  ).length;
  const codConfirmationRate = totalOrdersCount > 0
    ? Math.round((confirmedOrDeliveredCount / totalOrdersCount) * 100)
    : 100;

  const pendingCount = orders.filter((o) => o.status === 'pending_confirmation').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <AdminContext.Provider
      value={{
        orders,
        products,
        reviews,
        coupons,
        addOrder,
        updateOrderStatus,
        updateProduct,
        addNewProduct,
        deleteProduct,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        supabaseConnected,
        kpis: {
          totalSales,
          totalOrdersCount,
          avgOrderValue,
          codConfirmationRate,
          pendingCount,
          shippedCount,
          deliveredCount
        }
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
