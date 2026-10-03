import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { CUSTOMER_REVIEWS } from '../../data/reviews';
import heroBanner from '../../assets/images/hero_banner.jpg';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Gift, 
  ArrowRight, 
  Star, 
  Eye, 
  Heart, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Check, 
  Flame,
  Award
} from 'lucide-react';

const InstagramIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function HomeView() {
  const { 
    t, 
    language, 
    navigateTo, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setQuickViewProduct,
    products
  } = useStore();

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });
  const [newsletterInput, setNewsletterInput] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const flashSaleItems = products.filter(p => p.isFlashSale).slice(0, 3);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterInput) return;
    setNewsletterSuccess(true);
    setNewsletterInput('');
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section" style={{ minHeight: '620px', display: 'flex', alignItems: 'center' }}>
        <img src={heroBanner} alt="TWISHIYAT Lifestyle" className="hero-bg" />
        <div className="hero-overlay" style={{ background: 'linear-gradient(90deg, rgba(12,13,14,0.92) 0%, rgba(12,13,14,0.78) 55%, rgba(12,13,14,0.45) 100%)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 5, padding: '40px 20px' }}>
          <div className="hero-content" style={{ maxWidth: '680px' }}>
            
            {/* Top Badge */}
            <div className="hero-tag" style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.45)', backdropFilter: 'blur(8px)' }}>
              <Sparkles size={15} color="var(--gold-400)" />
              <span style={{ letterSpacing: '0.12em', fontWeight: '700' }}>ÉLÉGANCE MAROCAINE • NOUVELLE COLLECTION</span>
            </div>
            
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: '1.18', margin: '14px 0 16px 0', fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
              L’Éclat du Raffinement, <br />
              <span style={{ background: 'linear-gradient(135deg, #F9E7B9 0%, #D4AF37 50%, #AA7C11 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                le Style du Maroc
              </span>
            </h1>

            <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: '#E5E7EB', lineHeight: '1.65', marginBottom: '24px' }}>
              Montres d’exception et bijoux de prestige à l’éclat inaltérable. 
              Sublimez votre allure au quotidien avec un raffinement accessible.
            </p>

            {/* Above-The-Fold Trust Pillars */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#F3F4F6' }}>
                <ShieldCheck size={15} color="var(--gold-400)" />
                <span><strong>Ouvrez avant de payer</strong></span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#F3F4F6' }}>
                <Truck size={15} color="var(--gold-400)" />
                <span><strong>Livraison Gratuite 24h-48h</strong></span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#F3F4F6' }}>
                <Gift size={15} color="var(--gold-400)" />
                <span><strong>Écrin Velours Offert</strong></span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="hero-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                className="btn-gold"
                onClick={() => navigateTo('catalog')}
                style={{ padding: '15px 32px', fontSize: '0.95rem', fontWeight: '700', boxShadow: '0 8px 24px rgba(212,175,55,0.35)' }}
              >
                <span>COMMANDER MAINTENANT</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-dark"
                onClick={() => navigateTo('catalog', 'watches')}
                style={{ padding: '15px 28px', fontSize: '0.92rem', background: 'rgba(12,13,14,0.7)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
              >
                <span>Explorer les Montres</span>
              </button>
            </div>

            {/* Quick Micro Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '30px', color: '#E5E7EB', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', color: 'var(--gold-400)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--gold-400)" />
                ))}
              </div>
              <span><strong>+4 800 Clients Satisfaits</strong> • Note 4.9/5 partout au Maroc 🇲🇦</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 1.5 QUICK MOBILE CATEGORY STORY-PILLS (Instant browsing driver) 🌟 */}
      <section style={{ background: '#FFFFFF', padding: '18px 0', borderBottom: '1px solid #EAE5DC', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: 'max-content', padding: '4px 0' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--gold-800)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="var(--gold-600)" />
              Collections :
            </span>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateTo('catalog', cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '30px',
                  border: '1.5px solid #E5E7EB',
                  background: '#FAF8F5',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-500)';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.background = '#FAF8F5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <Sparkles size={14} color="var(--gold-600)" />
                )}
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
                  {language === 'ar' ? cat.nameAr : cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MOROCCAN TRUST BADGES STRIP (Ultra-Reassuring) */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 className="trust-title">Vérification Avant Paiement</h4>
                <p className="trust-desc">Ouvrez votre colis et inspectez votre bijou avec le livreur avant de régler en espèces.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box" style={{ background: '#ECFDF5', color: '#059669' }}>
                <Truck size={26} />
              </div>
              <div>
                <h4 className="trust-title">Livraison Gratuite 24h-48h</h4>
                <p className="trust-desc">Expédition rapide et soignée directement à domicile dans toutes les villes du Royaume.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                <Sparkles size={26} />
              </div>
              <div>
                <h4 className="trust-title">Garantie & Éclat Durable</h4>
                <p className="trust-desc">Finitions haute précision avec traitement protecteur résistant à l’eau et au temps.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box" style={{ background: '#FDF2F8', color: '#BE185D' }}>
                <Gift size={26} />
              </div>
              <div>
                <h4 className="trust-title">Écrin Velours Offert</h4>
                <p className="trust-desc">Chaque création est livrée dans son luxueux coffret rigide TWISHIYAT prêt à offrir.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section style={{ padding: '80px 0', background: '#FBF9F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Collection Signature</span>
            <h2 className="section-title">{t('bestsellersTitle')}</h2>
            <p className="section-desc">{t('bestsellersSub')}</p>
          </div>

          <div className="product-grid">
            {bestSellers.map((product) => {
              const inWish = wishlist.includes(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div 
                    className="product-image-container"
                    onClick={() => navigateTo('product', product.id)}
                  >
                    <img src={product.image} alt={product.name} className="product-image" />
                    
                    <div className="product-badges">
                      {product.stock !== undefined && product.stock <= 0 ? (
                        <span className="badge-sale" style={{ background: '#EF4444', color: '#FFFFFF' }}>Rupture</span>
                      ) : (
                        <>
                          {product.badge && <span className="badge-gold">{product.badge}</span>}
                          {product.discountPercent && (
                            <span className="badge-sale">-{product.discountPercent}%</span>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      className={`product-wishlist-btn ${inWish ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      title="Ajouter aux favoris"
                    >
                      <Heart size={18} fill={inWish ? '#DC2626' : 'none'} />
                    </button>

                    <div className="product-quick-actions" onClick={(e) => e.stopPropagation()}>
                      {product.stock !== undefined && product.stock <= 0 ? (
                        <button
                          className="btn-dark"
                          style={{ flex: 1, padding: '9px 12px', fontSize: '0.8rem', background: '#475569' }}
                          onClick={() => navigateTo('product', product.id)}
                        >
                          <span>Rupture de Stock</span>
                        </button>
                      ) : (
                        <button
                          className="btn-gold"
                          style={{ flex: 1, padding: '9px 12px', fontSize: '0.8rem' }}
                          onClick={() => addToCart(product, 1)}
                        >
                          <ShoppingBag size={14} />
                          <span>{t('addToCart')}</span>
                        </button>
                      )}
                      <button
                        className="btn-dark"
                        style={{ padding: '9px 12px' }}
                        onClick={() => setQuickViewProduct(product)}
                        title="Aperçu rapide"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category-tag">{product.category}</span>
                    <h3 
                      className="product-title"
                      onClick={() => navigateTo('product', product.id)}
                    >
                      {language === 'ar' ? product.nameAr : product.name}
                    </h3>

                    <div className="product-rating">
                      <Star size={14} fill="#F59E0B" />
                      <span>{product.rating}</span>
                      <span style={{ color: '#9CA3AF' }}>({product.reviewsCount})</span>
                    </div>

                    <div className="product-price-row">
                      <span className="product-current-price">{product.price} DH</span>
                      {product.originalPrice && (
                        <span className="product-original-price">{product.originalPrice} DH</span>
                      )}
                    </div>

                    <button
                      className="btn-outline"
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginTop: 'auto' }}
                      onClick={() => navigateTo('product', product.id)}
                    >
                      <span>Commander en 1 Clic (COD)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button 
              className="btn-dark"
              onClick={() => navigateTo('catalog')}
              style={{ padding: '14px 36px' }}
            >
              <span>Voir Tous Les Produits ({products.length})</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. CURATED CATEGORIES SHOWCASE */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Explorez Nos Collections</span>
            <h2 className="section-title">{t('categoriesTitle')}</h2>
            <p className="section-desc">Des accessoires pensés pour chaque moment d'élégance</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateTo('catalog', cat.id)}
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #EAE5DC',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,13,14,0.85) 0%, rgba(12,13,14,0.2) 60%, transparent 100%)' }}></div>
                
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: '#FFFFFF' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                    {cat.count} Modèles
                  </span>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: '4px 0 8px 0', fontFamily: 'var(--font-serif)' }}>
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#E5E7EB', fontWeight: '500' }}>
                    Découvrir l'univers <ArrowRight size={14} color="var(--gold-400)" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FLASH SALE COUNTDOWN BANNER */}
      <section style={{ padding: '70px 0', background: 'var(--obsidian-950)', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
            <div style={{ maxWidth: '540px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Flame size={16} />
                <span>{t('flashSaleTitle')}</span>
              </div>

              <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '16px', lineHeight: '1.2' }}>
                Jusqu'à -40% sur la Sélection Prestige
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.6' }}>
                {t('flashSaleSub')} Paiement en espèces après vérification du colis partout au Maroc et écrin velours inclus.
              </p>

              {/* Countdown Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <span style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>{t('flashSaleEnds')}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: '#1C1F23', border: '1px solid var(--border-gold)', padding: '8px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '55px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--gold-400)', display: 'block' }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Heures</span>
                  </div>
                  <div style={{ background: '#1C1F23', border: '1px solid var(--border-gold)', padding: '8px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '55px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--gold-400)', display: 'block' }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Min</span>
                  </div>
                  <div style={{ background: '#1C1F23', border: '1px solid var(--border-gold)', padding: '8px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '55px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--gold-400)', display: 'block' }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Sec</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn-gold" 
                onClick={() => navigateTo('catalog')}
                style={{ padding: '14px 32px' }}
              >
                <span>Profiter de l'Offre Exclusive</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Featured Flash Item Card */}
            <div style={{ flex: '1 1 360px', maxWidth: '420px', background: '#141618', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '20px', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src={flashSaleItems[0]?.image} alt={flashSaleItems[0]?.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                <span className="badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  VENTE FLASH -{flashSaleItems[0]?.discountPercent}%
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                {language === 'ar' ? flashSaleItems[0]?.nameAr : flashSaleItems[0]?.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gold-400)' }}>
                  {flashSaleItems[0]?.price} DH
                </span>
                <span style={{ fontSize: '1rem', color: '#6B7280', textDecoration: 'line-through' }}>
                  {flashSaleItems[0]?.originalPrice} DH
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>Économisez 300 DH</span>
              </div>
              <button
                className="btn-gold"
                style={{ width: '100%' }}
                onClick={() => navigateTo('product', flashSaleItems[0]?.id)}
              >
                <span>Commander Maintenant (COD)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE TWISHIYAT */}
      <section style={{ padding: '80px 0', background: '#FAF8F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">L'Excellence Marocaine</span>
            <h2 className="section-title">{t('whyUsTitle')}</h2>
            <p className="section-desc">L'alliance parfaite entre le raffinement de la haute joaillerie et la mode accessible</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            <div style={{ background: '#FFFFFF', padding: '32px 24px', borderRadius: '12px', border: '1px solid #EFEAE2', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--sand-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid var(--border-gold)' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--obsidian-900)' }}>Finitions d’Exception Inaltérables</h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.6' }}>
                Notre procédé protecteur garantit un éclat durable qui résiste à l’eau, aux parfums et à l'humidité du quotidien.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '32px 24px', borderRadius: '12px', border: '1px solid #EFEAE2', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--sand-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid var(--border-gold)' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--obsidian-900)' }}>Alliage Noble Haute Résistance</h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.6' }}>
                100% hypoallergénique, sans nickel ni plomb. Ne noircit jamais et convient aux peaux les plus sensibles.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '32px 24px', borderRadius: '12px', border: '1px solid #EFEAE2', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--sand-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid var(--border-gold)' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--obsidian-900)' }}>Vérification du Colis Avant Paiement</h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.6' }}>
                Achetez en toute sérénité. Vous n'avez rien à avancer en ligne : inspectez votre bijou avec le livreur chez vous avant de payer.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '32px 24px', borderRadius: '12px', border: '1px solid #EFEAE2', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--sand-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid var(--border-gold)' }}>
                <Truck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--obsidian-900)' }}>Expédition Express Partout au Maroc</h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.6' }}>
                Expédition quotidienne rapide et soignée. Suivi de votre colis par SMS et WhatsApp dans toutes les villes du Royaume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED MOROCCAN CUSTOMER REVIEWS */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Témoignages Vérifiés</span>
            <h2 className="section-title">{t('reviewsTitle')}</h2>
            <p className="section-desc">{t('reviewsSub')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: '#FAF8F5',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #EFEAE2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '6px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#F59E0B" />
                      ))}
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
                      {language === 'ar' ? rev.titleAr : rev.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{rev.date}</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{language === 'ar' ? rev.commentAr : rev.comment}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--obsidian-900)', color: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block' }}>
                        {rev.customerName}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-700)' }}>
                        📍 {rev.city}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <CheckCircle2 size={13} /> Achat Vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SHOPPABLE INSTAGRAM & TIKTOK FEED */}
      <section style={{ padding: '70px 0', background: '#FAF8F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Rejoignez-Nous</span>
            <h2 className="section-title">{t('instaTitle')}</h2>
            <p className="section-desc">{t('instaSub')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>
              <a
                href="https://www.instagram.com/twishiyat_/"
                target="_blank"
                rel="me noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#FFFFFF',
                  padding: '11px 22px',
                  borderRadius: '30px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(220, 39, 67, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 39, 67, 0.45)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 39, 67, 0.3)'; }}
              >
                <InstagramIcon size={18} color="#FFFFFF" />
                <span>Suivre @twishiyat_</span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61594978681127"
                target="_blank"
                rel="me noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#1877F2',
                  color: '#FFFFFF',
                  padding: '11px 22px',
                  borderRadius: '30px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(24, 119, 242, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(24, 119, 242, 0.45)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(24, 119, 242, 0.3)'; }}
              >
                <FacebookIcon size={18} color="#FFFFFF" />
                <span>Page Facebook</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {products.slice(0, 5).map((prod, idx) => (
              <div
                key={prod.id}
                onClick={() => navigateTo('product', prod.id)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const tag = e.currentTarget.querySelector('.insta-hover-tag');
                  if (tag) tag.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const tag = e.currentTarget.querySelector('.insta-hover-tag');
                  if (tag) tag.style.opacity = '0';
                }}
              >
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div 
                  className="insta-hover-tag"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(12,13,14,0.65)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    color: '#FFFFFF',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <InstagramIcon size={24} color="var(--gold-400)" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>{prod.name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gold-300)', fontWeight: '700', marginTop: '4px' }}>
                    {prod.price} DH
                  </span>
                  <span style={{ fontSize: '0.72rem', textDecoration: 'underline', marginTop: '6px' }}>
                    Acheter le look →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VIP PRIVILEGE NEWSLETTER */}
      <section style={{ padding: '70px 0', background: 'var(--grad-dark)', color: '#FFFFFF', borderTop: '1px solid var(--border-gold)' }}>
        <div className="container" style={{ maxWidth: '750px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--gold-400)' }}>
            <Sparkles size={24} />
          </div>

          <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '12px' }}>
            {t('newsletterTitle')}
          </h2>
          <p style={{ color: '#D1D5DB', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.6' }}>
            {t('newsletterSub')}
          </p>

          {newsletterSuccess ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', padding: '16px', borderRadius: '8px', color: '#A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} />
              <span>Félicitations ! Votre code promo <strong>TWISHIYAT10</strong> (-10%) a été activé !</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="text"
                required
                value={newsletterInput}
                onChange={(e) => setNewsletterInput(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                style={{
                  flex: '1 1 300px',
                  padding: '14px 20px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-gold)',
                  background: '#1A1D20',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-gold" style={{ padding: '14px 28px' }}>
                {t('subscribeBtn')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
