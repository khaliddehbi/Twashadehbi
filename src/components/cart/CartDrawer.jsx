import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Truck
} from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../data/moroccanCities';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartItemCount,
    isFreeShipping,
    discountAmount,
    appliedCoupon,
    applyCouponCode,
    navigateTo,
    language,
    t
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 25; // standard base shipping
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCouponCode(couponInput);
    setCouponInput('');
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} color="var(--gold-600)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
              {t('cartTitle')} ({cartItemCount})
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ color: '#6B7280', padding: '4px', borderRadius: '50%' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Dynamic Free Shipping Progress Bar */}
        <div style={{ background: '#FAF8F5', padding: '14px 24px', borderBottom: '1px solid #EFEAE2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', marginBottom: '8px', color: 'var(--obsidian-900)' }}>
            <Truck size={16} color="var(--gold-600)" />
            <span>
              {isFreeShipping
                ? t('freeShippingUnlocked')
                : t('freeShippingThresholdText').replace('{amount}', remainingForFreeShipping)}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: 'var(--grad-gold)', 
                transition: 'width 0.4s ease' 
              }} 
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px auto', strokeWidth: 1.5, opacity: 0.5 }} />
              <p style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--obsidian-800)', marginBottom: '8px' }}>
                {t('cartEmpty')}
              </p>
              <button 
                className="btn-gold" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('catalog');
                }}
              >
                {t('startShopping')}
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${index}`}
                style={{
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #F3F4F6'
                }}
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB', flexShrink: 0 }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--obsidian-900)', lineHeight: '1.3' }}>
                      {language === 'ar' ? item.product.nameAr : item.product.name}
                    </h4>
                    <button 
                      onClick={() => removeFromCart(index)}
                      style={{ color: '#9CA3AF', padding: '2px', cursor: 'pointer' }}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Variant / Size info */}
                  <div style={{ fontSize: '0.78rem', color: '#6B7280', margin: '4px 0 8px 0' }}>
                    {item.variant?.name && <span>{item.variant.name}</span>}
                    {item.size && <span> • {item.size}</span>}
                  </div>

                  {/* Quantity and Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: '4px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateCartQuantity(index, -1)}
                        style={{ padding: '4px 8px', background: '#F9FAFB', color: '#4B5563' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '2px 10px', fontSize: '0.85rem', fontWeight: '600' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(index, 1)}
                        style={{ padding: '4px 8px', background: '#F9FAFB', color: '#4B5563' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--obsidian-950)' }}>
                        {item.product.price * item.quantity} DH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Tag size={15} color="#9CA3AF" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={appliedCoupon ? `Code actif: ${appliedCoupon.code}` : "Code promo (ex: TWASHA10)"}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    fontSize: '0.85rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    outline: 'none'
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={{ background: 'var(--obsidian-900)', color: 'var(--gold-400)', padding: '0 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600' }}
              >
                {t('applyPromo')}
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>{t('cartSubtotal')}</span>
                <span style={{ fontWeight: '600', color: 'var(--obsidian-900)' }}>{cartSubtotal} DH</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '600' }}>
                  <span>Réduction ({appliedCoupon?.code})</span>
                  <span>-{discountAmount} DH</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>{t('cartShipping')}</span>
                <span style={{ fontWeight: '600', color: isFreeShipping ? '#059669' : 'var(--obsidian-900)' }}>
                  {isFreeShipping ? 'GRATUIT (Offert)' : `${shippingFee} DH`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700', color: 'var(--obsidian-950)', borderTop: '1px solid #E5E7EB', paddingTop: '10px', marginTop: '4px' }}>
                <span>{t('cartTotal')}</span>
                <span style={{ color: 'var(--obsidian-950)' }}>{finalTotal} DH</span>
              </div>
            </div>

            {/* Moroccan COD Reassurance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.1)', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.78rem', color: 'var(--gold-800)' }}>
              <ShieldCheck size={18} color="var(--gold-600)" style={{ flexShrink: 0 }} />
              <span>Paiement en espèces à la livraison après vérification du colis.</span>
            </div>

            {/* Checkout Button */}
            <button
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
            >
              <span>Commander (Paiement à la Livraison)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
