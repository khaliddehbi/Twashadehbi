import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import brandLogo from '../../assets/images/logo.png';
import { MOROCCAN_CITIES } from '../../data/moroccanCities';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Phone, 
  ShoppingBag,
  Search,
  Edit2,
  Save,
  ShieldCheck,
  Check,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AccountView() {
  const { 
    wishlist, 
    toggleWishlist, 
    navigateTo, 
    addToCart, 
    products,
    customerProfile,
    updateCustomerProfile,
    customerOrders,
    addToast
  } = useStore();

  const { orders: adminOrders } = useAdmin();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'wishlist', 'addresses', 'profile'
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Editable Profile / Address State
  const [formData, setFormData] = useState({
    fullName: customerProfile?.fullName || '',
    phone: customerProfile?.phone || '',
    email: customerProfile?.email || '',
    city: customerProfile?.city || 'Casablanca',
    address: customerProfile?.address || ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Synchronize customer orders with authoritative admin & Supabase orders in real-time
  const liveCustomerOrders = useMemo(() => {
    const list = [...customerOrders];

    // If customer has a phone number, match any previous orders with that phone
    const cleanPhone = (customerProfile?.phone || formData?.phone || '').trim().replace(/[\s\-\.]/g, '');
    if (cleanPhone.length >= 8 && Array.isArray(adminOrders)) {
      adminOrders.forEach((ao) => {
        const aoPhone = (ao.customer?.phone || '').trim().replace(/[\s\-\.]/g, '');
        if (aoPhone && (aoPhone === cleanPhone || aoPhone.endsWith(cleanPhone.slice(-8))) && !list.some((o) => o.id === ao.id)) {
          list.push(ao);
        }
      });
    }

    // Merge each order with the authoritative status and timeline from adminOrders
    return list.map((cOrd) => {
      const live = adminOrders?.find((ao) => ao.id === cOrd.id);
      if (live) {
        return {
          ...cOrd,
          status: live.status,
          statusLabel: live.statusLabel,
          carrier: live.carrier || cOrd.carrier,
          timeline: live.timeline || cOrd.timeline
        };
      }
      return cOrd;
    });
  }, [customerOrders, adminOrders, customerProfile?.phone, formData?.phone]);

  const getOrderStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', label: '✅ Livrée & Encaissée' };
      case 'out_for_delivery':
        return { bg: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', label: '🛵 En cours de livraison avec coursier' };
      case 'shipped':
        return { bg: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', label: '🚚 Expédiée / En transit' };
      case 'processing':
        return { bg: '#F3E8FF', color: '#6B21A8', border: '1px solid #E9D5FF', label: '📦 En préparation en atelier' };
      case 'confirmed':
        return { bg: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', label: '📞 Confirmée par nos équipes' };
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', label: '❌ Commande Annulée' };
      default:
        return { bg: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', label: '⏳ En attente de confirmation' };
    }
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const hasName = Boolean(customerProfile?.fullName?.trim());
  const displayName = hasName ? customerProfile.fullName : 'Espace Client TWISHIYAT';
  const displaySubtitle = hasName 
    ? 'Membre Privilège TWISHIYAT • Maroc' 
    : 'Espace Personnel Sécurisé • Suivi de vos commandes & favoris';
  
  const initials = hasName 
    ? customerProfile.fullName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : null;

  const handleSaveData = (e) => {
    e.preventDefault();
    updateCustomerProfile(formData);
    setIsEditingProfile(false);
    setIsEditingAddress(false);
    addToast('Vos coordonnées ont été enregistrées avec succès !');
  };

  const handleTrackSearch = (e) => {
    e.preventDefault();
    const cleanId = trackingNumberInput.trim().toUpperCase();
    if (!cleanId) return;
    navigateTo('tracking', cleanId);
  };

  return (
    <div style={{ padding: '50px 0 100px 0', background: '#FBF9F5', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Customer Header Banner */}
        <div style={{ background: 'var(--obsidian-950)', color: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {initials ? (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--grad-gold)', color: 'var(--obsidian-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}>
                {initials}
              </div>
            ) : (
              <img
                src={brandLogo}
                alt="TWISHIYAT"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--gold-500)',
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.35)',
                  background: '#F7F3EC',
                  flexShrink: 0
                }}
              />
            )}
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>
                {displayName}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--gold-400)', display: 'block', marginTop: '2px' }}>
                {displaySubtitle}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigateTo('catalog')}
              className="btn-gold"
              style={{ fontSize: '0.85rem', padding: '10px 18px' }}
            >
              <ShoppingBag size={15} />
              <span>Découvrir la collection</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'orders', label: `Mes Commandes (${liveCustomerOrders.length})`, icon: Package },
            { id: 'wishlist', label: `Favoris (${wishlistProducts.length})`, icon: Heart },
            { id: 'addresses', label: 'Adresse de Livraison', icon: MapPin },
            { id: 'profile', label: 'Mes Coordonnées', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  color: isActive ? 'var(--gold-800)' : '#6B7280',
                  borderBottom: isActive ? '3px solid var(--gold-600)' : '3px solid transparent',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div>
            {liveCustomerOrders.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ textAlign: 'center', padding: '50px 24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEAE2', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-700)', margin: '0 auto 16px auto' }}>
                    <Package size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-900)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                    Aucune commande enregistrée
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
                    Vous n'avez pas encore passé de commande depuis ce navigateur. Vos prochains achats apparaîtront ici automatiquement avec leur suivi en direct.
                  </p>
                  <button className="btn-gold" onClick={() => navigateTo('catalog')}>
                    <ShoppingBag size={16} />
                    <span>Commencer mes achats</span>
                  </button>
                </div>

                {/* Direct Order Lookup Card */}
                <div style={{ background: '#FFFFFF', padding: '24px 28px', borderRadius: '14px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--obsidian-950)', margin: '0 0 4px 0' }}>
                      Vous avez déjà passé commande ?
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
                      Entrez votre référence reçue par SMS ou WhatsApp (ex: TW-8492) pour suivre votre colis en temps réel.
                    </p>
                  </div>
                  <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '8px', flexGrow: 1, maxWidth: '400px' }}>
                    <input
                      type="text"
                      required
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      placeholder="N° de commande (ex: TW-8492)..."
                      style={{ flexGrow: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem', textTransform: 'uppercase', outline: 'none' }}
                    />
                    <button type="submit" className="btn-dark" style={{ padding: '0 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <Search size={15} />
                      <span>Suivre</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {liveCustomerOrders.map((ord) => {
                  const statusConfig = getOrderStatusConfig(ord.status);
                  const isExpanded = expandedOrderId === ord.id;

                  return (
                    <div
                      key={ord.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EFEAE2',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'box-shadow 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Commande N°</span>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-900)', margin: 0, fontWeight: '800' }}>
                              {ord.id}
                            </h3>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'block', marginTop: '2px' }}>
                            {ord.date ? new Date(ord.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Récemment'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              background: statusConfig.bg,
                              color: statusConfig.color,
                              border: statusConfig.border,
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '700'
                            }}
                          >
                            {statusConfig.label}
                          </span>

                          <button
                            className="btn-dark"
                            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                            onClick={() => navigateTo('tracking', ord.id)}
                            title="Suivre le colis avec toutes les étapes"
                          >
                            <Truck size={14} />
                            <span>Suivre le colis</span>
                          </button>
                        </div>
                      </div>

                      {/* Items in order */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                        {ord.items?.map((it, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {it.image && (
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                                />
                              )}
                              <span>
                                <strong>{it.quantity}x</strong> {it.name} {it.variant ? `(${it.variant})` : ''} {it.size ? `• ${it.size}` : ''}
                              </span>
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--obsidian-900)' }}>
                              {it.price * it.quantity} DH
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Step Timeline Accordion Toggle */}
                      {ord.timeline && ord.timeline.length > 0 && (
                        <div style={{ marginBottom: '14px', borderTop: '1px dashed #E5E7EB', paddingTop: '10px' }}>
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--gold-800)', fontSize: '0.82rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '4px 0' }}
                          >
                            <Clock size={14} />
                            <span>{isExpanded ? 'Masquer le parcours logistique' : 'Afficher les étapes de livraison'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          {isExpanded && (
                            <div style={{ marginTop: '12px', background: '#FAF8F5', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {ord.timeline.map((step, sIdx) => (
                                <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      background: step.completed ? 'var(--gold-500)' : '#E5E7EB',
                                      color: step.completed ? '#000' : '#9CA3AF',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      marginTop: '2px'
                                    }}
                                  >
                                    {step.completed ? <Check size={14} /> : <Clock size={12} />}
                                  </div>
                                  <div style={{ flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                      <span style={{ fontSize: '0.85rem', fontWeight: step.current ? '700' : '500', color: step.current ? 'var(--gold-900)' : '#374151' }}>
                                        {step.title}
                                      </span>
                                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{step.date}</span>
                                    </div>
                                    {step.current && (
                                      <span style={{ fontSize: '0.72rem', color: '#059669', background: '#D1FAE5', padding: '1px 6px', borderRadius: '4px', fontWeight: '600', display: 'inline-block', marginTop: '2px' }}>
                                        Étape actuelle
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '12px', fontSize: '0.82rem', color: '#6B7280', flexWrap: 'wrap', gap: '8px' }}>
                        <span>📍 Livraison à {ord.customer?.city} ({ord.customer?.address})</span>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                          Total : {ord.total} DH (Paiement COD à la réception)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFEAE2' }}>
                <Heart size={44} color="#D1D5DB" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Votre liste de coups de cœur est vide</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Enregistrez vos coups de cœur en cliquant sur le cœur sur n'importe quelle montre ou bijou.
                </p>
                <button className="btn-gold" onClick={() => navigateTo('catalog')}>
                  Découvrir la collection
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container" onClick={() => navigateTo('product', product.id)}>
                      <img src={product.image} alt={product.name} className="product-image" />
                      <button
                        className="product-wishlist-btn active"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                      >
                        <Heart size={18} fill="#DC2626" />
                      </button>
                    </div>
                    <div className="product-info">
                      <span className="product-category-tag">{product.category}</span>
                      <h3 className="product-title" onClick={() => navigateTo('product', product.id)}>
                        {product.name}
                      </h3>
                      <div className="product-price-row">
                        <span className="product-current-price">{product.price} DH</span>
                      </div>
                      <button
                        className="btn-gold"
                        style={{ width: '100%', padding: '9px', fontSize: '0.85rem' }}
                        onClick={() => addToCart(product, 1)}
                      >
                        <ShoppingBag size={15} />
                        <span>Ajouter au Panier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Delivery Address */}
        {activeTab === 'addresses' && (
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #EFEAE2', maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-950)', margin: '0 0 4px 0' }}>
                  Adresse de Livraison
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
                  Votre adresse par défaut utilisée pour la livraison à domicile avec Amana / Cathedis.
                </p>
              </div>
              {customerProfile?.address && !isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                >
                  <Edit2 size={14} />
                  <span>Modifier</span>
                </button>
              )}
            </div>

            {customerProfile?.address && !isEditingAddress ? (
              <div style={{ background: '#FAF8F5', border: '1.5px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span className="badge-gold">Adresse de Livraison Principale</span>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>✓ Prête pour commande rapide</span>
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--obsidian-900)', lineHeight: '1.7' }}>
                  <strong>Destinataire :</strong> {customerProfile.fullName || 'Non renseigné'}<br />
                  <strong>Téléphone WhatsApp :</strong> {customerProfile.phone || 'Non renseigné'}<br />
                  <strong>Ville :</strong> {customerProfile.city || 'Casablanca'}<br />
                  <strong>Adresse complète :</strong> {customerProfile.address}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveData} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                    Nom et Prénom du Destinataire *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Votre nom complet..."
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                      Numéro de Téléphone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="ex: 06 12 34 56 78"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                      Ville de Livraison *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF' }}
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name} ({c.nameAr})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                    Adresse Exacte (Quartier, Rue, N°, Résidence) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="ex: Quartier Maarif, Rue Abou Al Alaa, Immeuble 12, Apt 4"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="submit" className="btn-gold" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                    <Save size={16} />
                    <span>Enregistrer mon adresse</span>
                  </button>
                  {customerProfile?.address && isEditingAddress && (
                    <button type="button" onClick={() => setIsEditingAddress(false)} className="btn-outline" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Profile Info */}
        {activeTab === 'profile' && (
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #EFEAE2', maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-950)', margin: '0 0 4px 0' }}>
                  Mes Coordonnées
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
                  Gérez vos informations de contact pour le suivi de vos commandes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveData} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                  Nom Complet
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Votre nom et prénom..."
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                    Numéro de Téléphone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ex: 07 08 75 95 10"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                    Ville de Résidence
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF' }}
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name} ({c.nameAr})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                  Adresse Email (Optionnelle)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@exemple.ma"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                  Devise de Paiement
                </label>
                <input
                  type="text"
                  readOnly
                  value="🇲🇦 MAD (Dirham Marocain)"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '0.9rem', color: '#6B7280' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-gold" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                  <Save size={16} />
                  <span>Enregistrer mes coordonnées</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
