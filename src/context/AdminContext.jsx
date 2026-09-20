import React, { createContext, useContext, useState } from 'react';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { PRODUCTS } from '../data/products';
import { CUSTOMER_REVIEWS } from '../data/reviews';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(PRODUCTS);
  const [reviews, setReviews] = useState(CUSTOMER_REVIEWS);
  const [coupons, setCoupons] = useState([
    { code: 'TWASHA10', type: 'percentage', value: 10, uses: 142, active: true },
    { code: 'MAROC', type: 'shipping', value: 0, uses: 89, active: true },
    { code: 'VIP20', type: 'percentage', value: 20, uses: 34, active: true }
  ]);

  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
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

          // Update timeline
          const updatedTimeline = ord.timeline.map((step) => {
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
