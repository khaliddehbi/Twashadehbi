import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo, language, t } = useStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const currentVariant = selectedVariant || quickViewProduct.variants?.[0] || null;
  const currentSize = selectedSize || quickViewProduct.sizes?.[0] || 'Standard';

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, currentVariant, currentSize);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, currentVariant, currentSize);
    setQuickViewProduct(null);
    navigateTo('checkout');
  };

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: '#FFFFFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: '#4B5563' }}
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div style={{ flex: '1 1 350px', background: '#F9F8F5', position: 'relative' }}>
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '350px' }}
          />
          {quickViewProduct.badge && (
            <span className="badge-gold" style={{ position: 'absolute', top: '16px', left: '16px' }}>
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Details Column */}
        <div style={{ flex: '1 1 380px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--gold-700)', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '6px' }}>
            {quickViewProduct.category} • TWASHA DEHBI
          </span>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--obsidian-900)', marginBottom: '10px', lineHeight: '1.3' }}>
            {language === 'ar' ? quickViewProduct.nameAr : quickViewProduct.name}
          </h3>

          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', color: '#F59E0B' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#F59E0B" />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4B5563' }}>
              {quickViewProduct.rating} ({quickViewProduct.reviewsCount} avis)
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--obsidian-950)' }}>
              {quickViewProduct.price} DH
            </span>
            {quickViewProduct.originalPrice && (
              <>
                <span style={{ fontSize: '1.05rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  {quickViewProduct.originalPrice} DH
                </span>
                <span className="badge-sale">
                  -{quickViewProduct.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.6', marginBottom: '20px' }}>
            {language === 'ar' ? quickViewProduct.shortDescriptionAr : quickViewProduct.shortDescription}
          </p>

          {/* Variants */}
          {quickViewProduct.variants && quickViewProduct.variants.length > 1 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '8px' }}>
                Finition : {currentVariant?.name}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {quickViewProduct.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: v.colorHex,
                      border: currentVariant?.id === v.id ? '2px solid var(--obsidian-900)' : '2px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    title={v.name}
                  >
                    {currentVariant?.id === v.id && (
                      <Check size={16} color={v.colorHex === '#1A1A1A' ? '#FFF' : '#000'} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {quickViewProduct.sizes && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '8px' }}>
                Taille disponible :
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      border: currentSize === s ? '1.5px solid var(--gold-600)' : '1px solid #D1D5DB',
                      background: currentSize === s ? 'var(--gold-50)' : '#FFFFFF',
                      color: currentSize === s ? 'var(--gold-800)' : 'var(--obsidian-800)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button
              onClick={handleAddToCart}
              className="btn-dark"
              style={{ flex: 1, padding: '12px' }}
            >
              <ShoppingBag size={18} />
              <span>{t('addToCart')}</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-gold"
              style={{ flex: 1, padding: '12px' }}
            >
              <span>{t('buyNow')}</span>
            </button>
          </div>

          <button
            onClick={() => {
              navigateTo('product', quickViewProduct.id);
              setQuickViewProduct(null);
            }}
            style={{ marginTop: '14px', fontSize: '0.82rem', color: 'var(--gold-700)', fontWeight: '600', textAlign: 'center' }}
          >
            Voir la fiche produit complète avec avis & livraison →
          </button>
        </div>
      </div>
    </div>
  );
}
