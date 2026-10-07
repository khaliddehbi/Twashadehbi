import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { PRODUCTS } from '../../data/products';
import { MOROCCAN_CITIES, validateMoroccanPhone } from '../../data/moroccanCities';
import { CUSTOMER_REVIEWS } from '../../data/reviews';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ShoppingBag, 
  Heart, 
  Check, 
  Phone, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles,
  ArrowRight,
  Flame,
  UserCheck,
  Share2,
  AlertCircle
} from 'lucide-react';

export default function ProductDetailView() {
  const { 
    selectedProductId, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    navigateTo, 
    language, 
    t, 
    addToast,
    trackPixel,
    setLastPlacedOrder,
    products,
    recordCustomerOrder,
    recordProductView
  } = useStore();

  const { addOrder } = useAdmin();

  const product = products.find(
    (p) =>
      p.id === selectedProductId ||
      p.slug === selectedProductId ||
      p.alias === selectedProductId ||
      (p.slug && p.slug.toLowerCase() === (selectedProductId || '').toLowerCase())
  ) || products[0];

  const [activeImage, setActiveImage] = useState(product?.image);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState('specs'); // 'specs', 'delivery', 'care'
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      if (product.id && recordProductView) {
        recordProductView(product.id);
      }
    }
  }, [product?.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Moroccan Express COD 1-Click Form State
  const [expressName, setExpressName] = useState('');
  const [expressPhone, setExpressPhone] = useState('');
  const [expressCity, setExpressCity] = useState('');
  const [expressAddress, setExpressAddress] = useState('');
  const [expressSubmitting, setExpressSubmitting] = useState(false);
  const isExpressSubmittingRef = useRef(false);

  // New review form
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const inWish = wishlist.includes(product.id);
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const productReviews = CUSTOMER_REVIEWS.filter((r) => r.productId === product.id);

  // Moroccan 1-Click Express COD Order Handler
  const handleExpressOrder = (e) => {
    e.preventDefault();

    if (isExpressSubmittingRef.current || expressSubmitting) {
      console.warn('[Express] Order submission in progress, ignoring double click.');
      return;
    }

    if (!expressName.trim()) {
      addToast('Veuillez renseigner votre nom complet.', 'error');
      return;
    }
    if (!validateMoroccanPhone(expressPhone)) {
      addToast('Veuillez entrer un numéro marocain valide (ex: 06 61 00 00 00).', 'error');
      return;
    }
    if (!expressCity.trim()) {
      addToast('Veuillez renseigner votre ville de livraison.', 'error');
      return;
    }
    if (!expressAddress.trim()) {
      addToast('Veuillez préciser votre adresse de livraison.', 'error');
      return;
    }

    if (product.stock !== undefined && product.stock <= 0) {
      addToast('Ce produit est actuellement en rupture temporaire de stock.', 'error');
      return;
    }

    isExpressSubmittingRef.current = true;
    setExpressSubmitting(true);

    const totalOrderAmount = product.price * quantity;
    const isFree = true;
    const shippingFee = 0;

    const orderId = `TD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        fullName: expressName,
        phone: expressPhone,
        city: expressCity,
        address: expressAddress,
        neighborhood: '',
        notes: 'Commande Express 1-Clic'
      },
      items: [
        {
          productId: product.id,
          name: product.name,
          variant: selectedVariant?.name || '',
          price: product.price,
          quantity: quantity,
          image: product.image
        }
      ],
      subtotal: totalOrderAmount,
      deliveryFee: shippingFee,
      discount: 0,
      total: totalOrderAmount + shippingFee,
      paymentMethod: 'cod',
      status: 'pending_confirmation',
      statusLabel: 'En attente de confirmation WhatsApp / Téléphone',
      carrier: `Express ${expressCity}`,
      timeline: [
        { status: 'received', title: 'Commande Reçue sur le site', date: 'À l’instant', completed: true, current: true },
        { status: 'confirmed', title: 'Confirmation téléphonique en cours', date: 'Sous 15 min', completed: false },
        { status: 'processing', title: 'Préparation soignée en atelier TWISHIYAT', date: 'Aujourd’hui', completed: false },
        { status: 'shipped', title: `Expédition vers ${expressCity.trim()}`, date: 'En cours', completed: false },
        { status: 'delivered', title: 'Livraison & Paiement espèces au livreur', date: 'Remise en main propre', completed: false }
      ]
    };

    setTimeout(() => {
      addOrder(newOrder);
      recordCustomerOrder(newOrder);
      setLastPlacedOrder(newOrder);
      trackPixel('Purchase', { id: orderId, value: newOrder.total, currency: 'MAD' });
      setExpressSubmitting(false);
      isExpressSubmittingRef.current = false;
      navigateTo('confirmation', newOrder.id);
    }, 600);
  };

  const handleStandardAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
  };

  const handleStandardBuyNow = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
    navigateTo('checkout');
  };

  const handleWhatsAppInquiry = () => {
    const text = `Salam TWISHIYAT ! Je souhaite commander le produit : "${product.name}" au prix de ${product.price} DH. Est-il disponible ?`;
    window.open(`https://wa.me/212708759510?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    setReviewSuccess(true);
    addToast('Merci ! Votre avis a été soumis avec succès.');
    setReviewName('');
    setReviewCity('');
    setReviewText('');
  };

  return (
    <div className="pdp-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Accueil</span>
          <span>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('catalog', product.category)}>
            {product.category}
          </span>
          <span>/</span>
          <span style={{ color: 'var(--obsidian-900)', fontWeight: '600' }}>
            {language === 'ar' ? product.nameAr : product.name}
          </span>
        </div>

        {/* Main PDP Grid */}
        <div className="pdp-grid">
          {/* Left Column: Image Gallery */}
          <div className="pdp-gallery-col">
            <div className="pdp-main-image-container">
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.badge && (
                <span className="badge-gold" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  {product.badge}
                </span>
              )}

              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
                <button
                  className="product-wishlist-btn"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/#/produit/${product.slug || product.id}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(fullUrl);
                      addToast('Lien direct du produit copié ! Prêt à être partagé.');
                    }
                  }}
                  style={{ position: 'static' }}
                  title="Copier le lien de ce produit"
                >
                  <Share2 size={18} />
                </button>

                <button
                  className={`product-wishlist-btn ${inWish ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  style={{ position: 'static' }}
                  title="Ajouter aux favoris"
                >
                  <Heart size={20} fill={inWish ? '#DC2626' : 'none'} />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="pdp-thumbnails-wrapper">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`pdp-thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Moroccan Conversion Blocks */}
          <div className="pdp-info-col">
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-700)', fontWeight: '700' }}>
              Collection Haute Joaillerie Marocaine
            </span>

            <h1 className="pdp-title">
              {language === 'ar' ? product.nameAr : product.name}
            </h1>

            {/* Ratings & Stock Urgency */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B' }}>
                <div style={{ display: 'flex' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                  ({product.reviewsCount} avis vérifiés)
                </span>
              </div>

              {(product.stock !== undefined && product.stock <= 0) ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
                  <AlertCircle size={13} color="#DC2626" />
                  <span>Victime de son succès — Rupture de stock</span>
                </span>
              ) : (
                <span className="badge-stock">
                  <Flame size={13} color="#D97706" />
                  <span>Plus que {product.stock} pièces disponibles en stock</span>
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="pdp-price-box">
              <div className="pdp-price-row">
                <span className="pdp-price-current">
                  {product.price} DH
                </span>
                {product.originalPrice && (
                  <>
                    <span className="pdp-price-original">
                      {product.originalPrice} DH
                    </span>
                    <span className="badge-sale" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                      ÉCONOMISEZ {product.originalPrice - product.price} DH (-{product.discountPercent}%)
                    </span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gold-800)', fontWeight: '600' }}>
                <Check size={16} color="var(--gold-600)" />
                <span>Paiement en espèces à la livraison après vérification du colis.</span>
              </div>
            </div>

            {/* 🌟 LUXURY PACKAGING & ANTI-DOUBT ASSURANCE BOX 🌟 */}
            <div className="pdp-trust-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#065F46', fontWeight: '700' }}>
                <ShieldCheck size={17} color="#059669" />
                <span>100% Sécurisé : Ouvrez et vérifiez votre bijou avec le livreur avant de payer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--gold-900)', fontWeight: '600' }}>
                <Sparkles size={15} color="var(--gold-600)" />
                <span>Écrin cadeau velours noir TWISHIYAT & certificat d'authenticité offerts</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="pdp-description" style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>

            {/* Explanatory Product Description Images */}
            {product.descriptionImages && product.descriptionImages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px 0' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--obsidian-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  📸 Détails & Photos Explicatives :
                </span>
                <div className="pdp-desc-grid">
                  {product.descriptionImages.map((imgUrl, idx) => (
                    <div key={idx} className="pdp-desc-image-wrap">
                      <img src={imgUrl} alt={`Détail explicatif ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants Picker */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '8px' }}>
                  Finition sélectionnée : <span style={{ color: 'var(--gold-700)' }}>{selectedVariant?.name}</span>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: selectedVariant?.id === v.id ? '2px solid var(--gold-600)' : '1px solid #D1D5DB',
                        background: selectedVariant?.id === v.id ? 'var(--gold-50)' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.colorHex, border: '1px solid #CCC' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)' }}>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            {product.sizes && (
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '8px' }}>
                  Taille & Tour de poignet :
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: selectedSize === s ? '2px solid var(--gold-600)' : '1px solid #D1D5DB',
                        background: selectedSize === s ? 'var(--gold-50)' : '#FFFFFF',
                        color: selectedSize === s ? 'var(--gold-800)' : 'var(--obsidian-900)'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Cart Buttons & 1-Click Form OR Out of Stock Card */}
            {(product.stock !== undefined && product.stock <= 0) ? (
              <div style={{ background: '#FFF7ED', border: '1.5px solid #FDBA74', borderRadius: '14px', padding: '24px', marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#FFEDD5', color: '#C2410C', marginBottom: '12px' }}>
                  <AlertCircle size={26} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#9A3412', margin: '0 0 6px 0', fontFamily: 'var(--font-serif)' }}>
                  Modèle en Rupture Temporaire de Stock
                </h3>
                <p style={{ color: '#7C2D12', fontSize: '0.88rem', margin: '0 auto 18px auto', maxWidth: '440px', lineHeight: '1.5' }}>
                  En raison d'une forte demande, toutes les pièces préparées pour ce modèle ont été réservées. Notre atelier prépare le prochain réassort.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="btn-gold"
                    style={{ padding: '12px 22px', fontSize: '0.9rem' }}
                  >
                    <Phone size={16} />
                    <span>M'alerter lors du retour en stock</span>
                  </button>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="btn-dark"
                    style={{ padding: '12px 20px', fontSize: '0.9rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Voir les modèles disponibles</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Standard Cart Buttons */}
                <div className="pdp-cart-actions">
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #D1D5DB', borderRadius: '6px', background: '#FFFFFF' }}>
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '12px 14px', color: '#4B5563', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 14px', fontWeight: '700', fontSize: '1rem' }}>
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ padding: '12px 14px', color: '#4B5563', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn-dark"
                    style={{ flex: '1 1 180px', padding: '14px' }}
                    onClick={handleStandardAddToCart}
                  >
                    <ShoppingBag size={18} />
                    <span>{t('addToCart')}</span>
                  </button>

                  <button
                    className="btn-gold"
                    style={{ flex: '1 1 200px', padding: '14px' }}
                    onClick={handleStandardBuyNow}
                  >
                    <span>Acheter Maintenant</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* 🌟 MOROCCAN 1-CLICK EXPRESS COD ORDER BOX (Critical conversion driver!) 🌟 */}
                <div 
                  id="express-order-box"
                  className="express-order-card"
                  style={{ 
                    background: '#FFFFFF', 
                    border: '2px solid var(--gold-500)', 
                    borderRadius: '16px', 
                    padding: '24px', 
                    boxShadow: 'var(--shadow-gold)',
                    marginBottom: '32px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--grad-gold)', color: 'var(--obsidian-950)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      <Sparkles size={14} />
                      <span>Formulaire Express Maroc • Paiement à la Livraison</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.8rem', color: '#15803D', fontWeight: '700', background: '#F0FDF4', padding: '4px 12px', borderRadius: '14px', border: '1px solid #BBF7D0' }}>
                      <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
                        <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#22C55E', opacity: 0.75 }} />
                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '7px', width: '7px', background: '#16A34A' }} />
                      </span>
                      <span>16 visiteurs en ce moment</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.28rem', color: 'var(--obsidian-900)', marginBottom: '6px', fontFamily: 'var(--font-serif)' }}>
                    {t('expressOrderTitle')}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#6B7280', marginBottom: '18px' }}>
                    Remplissez vos coordonnées ci-dessous : livraison express à domicile partout au Maroc. Vous ne payez qu'après avoir inspecté votre bijou.
                  </p>

                  <form onSubmit={handleExpressOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                        {t('fullName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={expressName}
                        onChange={(e) => setExpressName(e.target.value)}
                        placeholder="ex: Youssef Bennani"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                        {language === 'ar' ? 'رقم الهاتف (الواتساب)' : 'Numéro de Téléphone / WhatsApp'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={expressPhone}
                        onChange={(e) => setExpressPhone(e.target.value)}
                        placeholder="06 XX XX XX XX ou 07 XX XX XX XX"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                        {t('city')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={expressCity}
                        onChange={(e) => setExpressCity(e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل مدينتك (مثال: الدار البيضاء، الرباط...)' : 'Votre ville (ex: Casablanca, Rabat, Marrakech...)'}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                        {t('address')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={expressAddress}
                        onChange={(e) => setExpressAddress(e.target.value)}
                        placeholder="ex: Quartier, Boulevard, N° Immeuble / Villa"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    {/* Total Preview */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #E5E7EB', paddingTop: '12px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.92rem', color: '#4B5563', fontWeight: '600' }}>Total à payer à la livraison :</span>
                      <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                        {product.price * quantity} DH
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={expressSubmitting}
                      className="btn-gold"
                      style={{ width: '100%', padding: '16px', fontSize: '1.02rem', fontWeight: '800', letterSpacing: '0.04em', marginTop: '6px', boxShadow: '0 8px 24px rgba(212,175,55,0.35)' }}
                    >
                      <Check size={20} />
                      <span>{expressSubmitting ? 'Validation en cours...' : 'CONFIRMER MA COMMANDE (PAIEMENT À LA LIVRAISON)'}</span>
                    </button>

                    {/* Direct WhatsApp Alternative Order Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const cityPart = expressCity.trim() ? ` pour livraison à ${expressCity.trim()}` : '';
                        const msg = `Salam TWISHIYAT ! Je souhaite commander en 1 Clic : "${product.name}" au prix de ${product.price * quantity} DH${cityPart}. Pouvez-vous confirmer ma commande ?`;
                        window.open(`https://wa.me/212708759510?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{
                        width: '100%',
                        background: '#25D366',
                        color: '#FFFFFF',
                        padding: '13px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '0.92rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,211,102,0.25)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Phone size={17} />
                      <span>OU COMMANDER DIRECTEMENT PAR WHATSAPP</span>
                    </button>
                  </form>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', fontSize: '0.8rem', color: '#065F46', fontWeight: '600' }}>
                    <ShieldCheck size={17} color="#059669" />
                    <span>Rappel : Vous inspectez votre bijou avant de payer le moindre dirham au livreur.</span>
                  </div>
                </div>
              </>
            )}

            {/* Accordion Information Tabs */}
            <div style={{ borderTop: '1px solid #E5E7EB' }}>
              {/* Specs Accordion */}
              <div style={{ borderBottom: '1px solid #E5E7EB' }}>
                <button
                  onClick={() => setOpenTab(openTab === 'specs' ? null : 'specs')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '0.95rem', color: 'var(--obsidian-900)' }}
                >
                  <span>Fiche Technique & Matériaux Nobles</span>
                  {openTab === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openTab === 'specs' && product.specs && (
                  <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    {Object.entries(product.specs).filter(([key]) => !key.toLowerCase().includes('garantie')).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ color: '#6B7280' }}>{key}</span>
                        {key.toLowerCase().includes('couleur') ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--obsidian-900)' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '13px',
                                height: '13px',
                                borderRadius: '50%',
                                backgroundColor: product.colorHex || product.variants?.[0]?.colorHex || '#D4AF37',
                                border: '1px solid rgba(0,0,0,0.18)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                              }}
                            />
                            <span>{val}</span>
                          </span>
                        ) : (
                          <span style={{ fontWeight: '600', color: 'var(--obsidian-900)', textAlign: 'right' }}>{val}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Accordion */}
              <div style={{ borderBottom: '1px solid #E5E7EB' }}>
                <button
                  onClick={() => setOpenTab(openTab === 'delivery' ? null : 'delivery')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '0.95rem', color: 'var(--obsidian-900)' }}
                >
                  <span>Livraison & Modalités par Ville au Maroc</span>
                  {openTab === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openTab === 'delivery' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Partout au Maroc :</strong> Expédition rapide à domicile avec remise en main propre par nos livreurs partenaires.
                    </p>
                    <div style={{ background: '#FAF8F5', padding: '10px 14px', borderRadius: '6px', marginTop: '10px', border: '1px solid #EAE5DC' }}>
                      <span style={{ color: 'var(--gold-800)', fontWeight: '600' }}>Inspection du colis :</span> Vous avez le droit d'ouvrir le paquet pour vérifier votre bijou avant de régler en espèces au livreur.
                    </div>
                  </div>
                )}
              </div>

              {/* Care Accordion */}
              <div style={{ borderBottom: '1px solid #E5E7EB' }}>
                <button
                  onClick={() => setOpenTab(openTab === 'care' ? null : 'care')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '0.95rem', color: 'var(--obsidian-900)' }}
                >
                  <span>Conseils d'Entretien & Précautions</span>
                  {openTab === 'care' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openTab === 'care' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6' }}>
                    <p>
                      Nos bijoux bénéficient d'un placage sous vide PVD haute résistance. Pour préserver son éclat au fil des années :
                    </p>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>Résistant à l'eau et aux éclaboussures.</li>
                      <li>Essuyez délicatement avec la chamoisine offerte après contact prolongé avec des produits agressifs.</li>
                      <li>Conservez dans l'écrin velours TWISHIYAT lorsque vous ne le portez pas.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section on PDP */}
        <section style={{ marginTop: '80px', borderTop: '1px solid #E5E7EB', paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--obsidian-950)', marginBottom: '8px' }}>
                Avis Clients & Retours d'Expérience
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{product.rating} sur 5</span>
                <span style={{ color: '#6B7280' }}>• Basé sur {product.reviewsCount} commandes livrées au Maroc</span>
              </div>
            </div>

            <button 
              className="btn-outline"
              onClick={() => {
                const el = document.getElementById('review-form-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Écrire un avis client
            </button>
          </div>

          {/* Reviews List */}
          <div className="reviews-grid">
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div key={rev.id} style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #EFEAE2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', color: '#F59E0B' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{rev.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>{rev.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '14px' }}>"{rev.comment}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--obsidian-900)' }}>{rev.customerName} (📍 {rev.city})</span>
                    <span style={{ color: '#059669', fontWeight: '600' }}>✓ Achat vérifié</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', background: '#FAF8F5', borderRadius: '8px', color: '#6B7280' }}>
                Soyez le premier à donner votre avis sur ce bijou !
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div id="review-form-box" style={{ background: '#FAF8F5', padding: '30px', borderRadius: '14px', border: '1px solid #EFEAE2', maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Partagez votre avis sur TWISHIYAT</h3>
            {reviewSuccess ? (
              <div style={{ background: '#D1FAE5', color: '#065F46', padding: '14px', borderRadius: '8px', fontSize: '0.9rem' }}>
                Merci pour votre avis ! Il sera visible après modération de notre équipe.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-grid-2">
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Votre nom"
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }}
                  />
                  <input
                    type="text"
                    required
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder="Votre ville (ex: Casablanca, Tanger...)"
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>Votre note :</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        style={{ color: num <= reviewRating ? '#F59E0B' : '#D1D5DB' }}
                      >
                        <Star size={20} fill={num <= reviewRating ? '#F59E0B' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows="3"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Que pensez-vous de la qualité, de l’éclat et de la livraison au Maroc ?"
                  style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none', fontFamily: 'inherit' }}
                />
                <button type="submit" className="btn-dark" style={{ alignSelf: 'flex-start' }}>
                  Publier mon avis
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--obsidian-950)', marginBottom: '24px' }}>
              Vous aimerez aussi
            </h2>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="product-card">
                  <div className="product-image-container" onClick={() => navigateTo('product', rel.id)}>
                    <img src={rel.image} alt={rel.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <span className="product-category-tag">{rel.category}</span>
                    <h3 className="product-title" onClick={() => navigateTo('product', rel.id)}>
                      {language === 'ar' ? rel.nameAr : rel.name}
                    </h3>
                    <div className="product-price-row">
                      <span className="product-current-price">{rel.price} DH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 🌟 MOBILE STICKY BUY BAR (Bottom Fixed CTA) 🌟 */}
      {showStickyBar && (
        <div
          className="mobile-sticky-buy-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderTop: '1.5px solid var(--border-gold)',
            boxShadow: '0 -6px 25px rgba(0,0,0,0.18)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            zIndex: 89,
            animation: 'slideUp 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E5E7EB', flexShrink: 0 }} 
            />
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {language === 'ar' ? product.nameAr : product.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--gold-700)' }}>
                  {product.price} DH
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                  Livraison Gratuite
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn-gold"
            style={{ padding: '12px 20px', fontSize: '0.88rem', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 4px 14px rgba(212,175,55,0.35)' }}
            onClick={() => {
              const el = document.getElementById('express-order-box');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                handleStandardAddToCart();
              }
            }}
          >
            <span>COMMANDER (COD)</span>
          </button>
        </div>
      )}
    </div>
  );
}
