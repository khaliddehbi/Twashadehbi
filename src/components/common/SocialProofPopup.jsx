import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, CheckCircle, X } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function SocialProofPopup() {
  const { language, navigateTo } = useStore();
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  const purchasers = [
    { name: 'Othmane', city: 'Casablanca (Maarif)', productIndex: 0, timeAgo: 'il y a 3 minutes' },
    { name: 'Salma', city: 'Rabat (Agdal)', productIndex: 2, timeAgo: 'il y a 8 minutes' },
    { name: 'Mehdi', city: 'Marrakech (Guéliz)', productIndex: 7, timeAgo: 'il y a 14 minutes' },
    { name: 'Kenza', city: 'Tanger (Malabata)', productIndex: 4, timeAgo: 'il y a 22 minutes' },
    { name: 'Amine', city: 'Fès (Atlas)', productIndex: 3, timeAgo: 'il y a 31 minutes' },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const data = purchasers[index % purchasers.length];
      const prod = PRODUCTS[data.productIndex] || PRODUCTS[0];
      setNotification({
        name: data.name,
        city: data.city,
        product: prod,
        timeAgo: data.timeAgo
      });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000);

      index++;
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '24px',
        background: '#FFFFFF',
        border: '1px solid var(--border-gold)',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '340px',
        zIndex: 85,
        animation: 'slideUp 0.3s ease'
      }}
    >
      <img
        src={notification.product.image}
        alt={notification.product.name}
        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' }}
        onClick={() => navigateTo('product', notification.product.id)}
      />
      <div style={{ flexGrow: 1, fontSize: '0.8rem', lineHeight: '1.35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: '600', fontSize: '0.75rem' }}>
          <CheckCircle size={12} />
          <span>Commande validée</span>
        </div>
        <p style={{ color: 'var(--obsidian-900)', fontWeight: '600', margin: '2px 0' }}>
          {notification.name} à {notification.city}
        </p>
        <p 
          style={{ color: 'var(--gold-700)', textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}
          onClick={() => navigateTo('product', notification.product.id)}
        >
          {language === 'ar' ? notification.product.nameAr : notification.product.name}
        </p>
        <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{notification.timeAgo}</span>
      </div>
      <button onClick={() => setVisible(false)} style={{ color: '#9CA3AF', padding: '2px' }}>
        <X size={14} />
      </button>
    </div>
  );
}
