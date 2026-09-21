import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { PRODUCTS } from '../data/products';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('twasha_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('twasha_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch (e) {
      return PRODUCTS;
    }
  });

  const [reviews, setReviews] = useState(CUSTOMER_REVIEWS);

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('twasha_coupons');
      return saved ? JSON.parse(saved) : [
        { code: 'TWASHA10', type: 'percentage', value: 10, uses: 142, active: true },
        { code: 'MAROC', type: 'shipping', value: 0, uses: 89, active: true },
        { code: 'VIP20', type: 'percentage', value: 20, uses: 34, active: true }
      ];
    } catch (e) {
      return [
        { code: 'TWASHA10', type: 'percentage', value: 10, uses: 142, active: true },
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
      localStorage.setItem('twasha_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('twasha_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('twasha_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  // Insert Order to Supabase and Local state
  const addOrder = async (newOrder) => {
    // 1. Update local state immediately for instant feedback
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Sync to Supabase Cloud
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

  // Update order status in Supabase and Local state
  const updateOrderStatus = async (orderId, newStatus) => {
    const nowStr = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    let statusLabel = '';
    if (newStatus === 'confirmed') statusLabel = 'Confirmée par WhatsApp / Appel';
    else if (newStatus === 'processing') statusLabel = 'En préparation en atelier';
    else if (newStatus === 'shipped') statusLabel = 'Expédiée avec Transporteur Express';
    else if (newStatus === 'out_for_delivery') statusLabel = 'En cours de livraison';
    else if (newStatus === 'delivered') statusLabel = 'Livrée & Encaissée';
    else if (newStatus === 'cancelled') statusLabel = 'Annulée / Refusée';

    let updatedTimeline = [];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          updatedTimeline = (ord.timeline || []).map((step) => {
            if (step.status === newStatus) {
              return { ...step, completed: true, current: true, date: nowStr };
            }
            return step;
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

    // Sync to Supabase Cloud
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

  const updateProduct = (productId, fields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...fields } : p))
    );
  };

  const addNewProduct = (productData) => {
    const newProd = {
      ...productData,
      id: `TD-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 1,
      gallery: [productData.image]
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
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
