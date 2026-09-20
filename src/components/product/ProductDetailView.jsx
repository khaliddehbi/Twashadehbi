import React, { useState } from 'react';
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
  UserCheck
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
    setLastPlacedOrder
  } = useStore();

  const { addOrder } = useAdmin();

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState('specs'); // 'specs', 'delivery', 'care'

  // Moroccan Express COD 1-Click Form State
  const [expressName, setExpressName] = useState('');
  const [expressPhone, setExpressPhone] = useState('');
  const [expressCity, setExpressCity] = useState('Casablanca');
  const [expressAddress, setExpressAddress] = useState('');
  const [expressSubmitting, setExpressSubmitting] = useState(false);

  // New review form
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const inWish = wishlist.includes(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const productReviews = CUSTOMER_REVIEWS.filter((r) => r.productId === product.id);

  // Moroccan 1-Click Express COD Order Handler
  const handleExpressOrder = (e) => {
    e.preventDefault();
    if (!expressName.trim()) {
      addToast('Veuillez renseigner votre nom complet.', 'error');
      return;
    }
    if (!validateMoroccanPhone(expressPhone)) {
      addToast('Veuillez entrer un numéro marocain valide (ex: 06 61 00 00 00).', 'error');
      return;
    }
    if (!expressAddress.trim()) {
      addToast('Veuillez préciser votre adresse de livraison.', 'error');
      return;
    }

    setExpressSubmitting(true);

    const cityData = MOROCCAN_CITIES.find(c => c.name === expressCity) || MOROCCAN_CITIES[0];
    const totalOrderAmount = product.price * quantity;
    const isFree = totalOrderAmount >= 350;
    const shippingFee = isFree ? 0 : cityData.deliveryFee;
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
        { status: 'processing', title: 'Préparation en atelier Casablanca', date: 'Aujourd’hui', completed: false },
        { status: 'shipped', title: `Expédition vers ${expressCity}`, date: cityData.deliveryHours, completed: false },
        { status: 'delivered', title: 'Livraison & Paiement espèces au livreur', date: `Prévue sous ${cityData.deliveryHours}`, completed: false }
      ]
    };

    setTimeout(() => {
      addOrder(newOrder);
      setLastPlacedOrder(newOrder);
      trackPixel('Purchase', { id: orderId, value: newOrder.total, currency: 'MAD' });
      setExpressSubmitting(false);
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
    const text = `Salam TWASHA DEHBI ! Je souhaite commander le bijou : "${product.name}" au prix de ${product.price} DH. Est-il disponible ?`;
    window.open(`https://wa.me/212661245890?text=${encodeURIComponent(text)}`, '_blank');
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
    <div style={{ padding: '30px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '24px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Image Gallery */}
          <div>
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                background: '#FAF8F5', 
                border: '1px solid #EFEAE2',
                aspectRatio: '1 / 1',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
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

              <button
                className={`product-wishlist-btn ${inWish ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                style={{ top: '16px', right: '16px' }}
              >
                <Heart size={20} fill={inWish ? '#DC2626' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--gold-500)' : '1px solid #E5E7EB',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Moroccan Conversion Blocks */}
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-700)', fontWeight: '700' }}>
              Collection Haute Joaillerie Marocaine
            </span>

            <h1 style={{ fontSize: '2.2rem', color: 'var(--obsidian-950)', margin: '8px 0 12px 0' }}>
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

              <span className="badge-stock">
                <Flame size={13} color="#D97706" />
                <span>Plus que {product.stock} pièces en stock à Casablanca</span>
              </span>
            </div>

            {/* Price Box */}
            <div style={{ background: '#FAF8F5', border: '1px solid #EFEAE2', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--obsidian-950)' }}>
                  {product.price} DH
                </span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: '1.2rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
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
                <span>Paiement en espèces à la réception de votre colis. Écrin cadeau velours offert !</span>
              </div>
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>

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

            {/* Standard Cart Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--grad-gold)', color: 'var(--obsidian-950)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                <Sparkles size={13} />
                <span>Formulaire Rapide Maroc (1 Clic)</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-900)', marginBottom: '6px' }}>
                {t('expressOrderTitle')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '18px' }}>
                {t('expressOrderSub')}
              </p>

              <form onSubmit={handleExpressOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={expressName}
                    onChange={(e) => setExpressName(e.target.value)}
                    placeholder="ex: Mehdi Bennani"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                    {language === 'ar' ? 'رقم الهاتف (الواتساب)' : 'Numéro de Téléphone / WhatsApp'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={expressPhone}
                    onChange={(e) => setExpressPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                      {t('city')} *
                    </label>
                    <select
                      value={expressCity}
                      onChange={(e) => setExpressCity(e.target.value)}
                      style={{ width: '100%', padding: '11px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem', background: '#FFF', outline: 'none' }}
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.deliveryHours})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                      Frais de port
                    </label>
                    <div style={{ padding: '11px 12px', background: '#FAF8F5', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', color: product.price * quantity >= 350 ? '#059669' : 'var(--obsidian-900)' }}>
                      {product.price * quantity >= 350 ? 'GRATUIT' : `${MOROCCAN_CITIES.find(c => c.name === expressCity)?.deliveryFee || 25} DH`}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '4px' }}>
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={expressAddress}
                    onChange={(e) => setExpressAddress(e.target.value)}
                    placeholder="ex: Boulevard Zerktouni, Immeuble 12, Apt 4"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                {/* Total Preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #E5E7EB', paddingTop: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Total à payer à la livraison :</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                    {product.price * quantity + (product.price * quantity >= 350 ? 0 : (MOROCCAN_CITIES.find(c => c.name === expressCity)?.deliveryFee || 25))} DH
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={expressSubmitting}
                  className="btn-gold"
                  style={{ width: '100%', padding: '15px', fontSize: '1.05rem', marginTop: '6px' }}
                >
                  <Check size={20} />
                  <span>{expressSubmitting ? 'Validation en cours...' : 'CONFIRMER MA COMMANDE (PAIEMENT À LA LIVRAISON)'}</span>
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: '#6B7280' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Paiement en espèces après vérification du colis à votre porte.</span>
              </div>
            </div>

            {/* WhatsApp Direct Inquiry Button */}
            <button
              onClick={handleWhatsAppInquiry}
              style={{
                width: '100%',
                background: '#25D366',
                color: '#FFFFFF',
                padding: '13px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                cursor: 'pointer',
                marginBottom: '32px'
              }}
            >
              <Phone size={18} />
              <span>Commander par WhatsApp avec un conseiller</span>
            </button>

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
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ color: '#6B7280' }}>{key}</span>
                        <span style={{ fontWeight: '600', color: 'var(--obsidian-900)' }}>{val}</span>
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
                  <span>Livraison & Délais par Ville au Maroc</span>
                  {openTab === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openTab === 'delivery' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Casablanca & Mohammedia :</strong> Livraison sous 24h par nos livreurs dédiés.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Rabat, Marrakech, Tanger, Fès, Meknès :</strong> Livraison sous 24h à 48h via Cathedis / Amana.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Agadir, Oujda, Régions du Sud :</strong> Livraison sous 48h à 72h.
                    </p>
                    <div style={{ background: '#FAF8F5', padding: '10px 14px', borderRadius: '6px', marginTop: '10px', border: '1px solid #EAE5DC' }}>
                      <span style={{ color: 'var(--gold-800)', fontWeight: '600' }}>Inspection garantie :</span> Vous avez le droit d'ouvrir le paquet pour vérifier votre bijou avant de régler en espèces au livreur.
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
                  <span>Conseils d'Entretien & Garantie 1 An</span>
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
                      <li>Conservez dans l'écrin velours TWASHA DEHBI lorsque vous ne le portez pas.</li>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '48px' }}>
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Partagez votre avis sur TWASHA DEHBI</h3>
            {reviewSuccess ? (
              <div style={{ background: '#D1FAE5', color: '#065F46', padding: '14px', borderRadius: '8px', fontSize: '0.9rem' }}>
                Merci pour votre avis ! Il sera visible après modération de notre équipe.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                  placeholder="Que pensez-vous de la qualité, de l’éclat de l'or et de la livraison au Maroc ?"
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
    </div>
  );
}
