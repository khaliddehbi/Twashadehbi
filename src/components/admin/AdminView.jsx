import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import brandLogo from '../../assets/images/logo.jpg';
import { IMAGE_PRESETS } from '../../data/products';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Phone, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Plus, 
  Tag, 
  Star,
  ExternalLink,
  ShieldCheck,
  FileText,
  X,
  Lock,
  LogOut,
  Store,
  KeyRound,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eye,
  Check,
  Percent
} from 'lucide-react';

export default function AdminView() {
  const { 
    orders, 
    products, 
    reviews, 
    coupons, 
    updateOrderStatus, 
    updateProduct, 
    addNewProduct,
    deleteProduct,
    kpis 
  } = useAdmin();

  const { addToast, navigateTo } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('twishiyat_admin_session') === 'active';
    } catch (e) {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'TwishiyatSousou') {
      try {
        sessionStorage.setItem('twishiyat_admin_session', 'active');
      } catch (err) {}
      setIsAuthenticated(true);
      setAuthError(false);
      addToast('Accès autorisé. Bienvenue dans l’Espace Pro TWISHIYAT !');
    } else {
      setAuthError(true);
      addToast('Mot de passe incorrect.', 'error');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('twishiyat_admin_session');
    } catch (err) {}
    setIsAuthenticated(false);
    setPasswordInput('');
    addToast('Vous êtes déconnecté de l’Espace Pro.');
    navigateTo('home');
  };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'coupons', 'reviews'
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [printableSlipOrder, setPrintableSlipOrder] = useState(null);

  // Comprehensive Product Form & Modal State
  const defaultProductFormData = {
    name: '',
    nameAr: '',
    category: 'watches',
    gender: 'men',
    price: 349,
    originalPrice: 499,
    stock: 10,
    badge: 'Best-Seller',
    image: '',
    gallery: [],
    shortDescription: '',
    shortDescriptionAr: '',
    description: '',
    descriptionAr: '',
    material: 'Acier Inoxydable 316L & Placage Or 18K PVD',
    waterResistance: '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)',
    glass: 'Saphir Inrayable traité antireflet',
    movement: 'Quartz Haute Précision Chronographe',
    dimensions: '41 mm (Épaisseur 11 mm)',
    warranty: 'Garantie Or 1 An incluse avec carte TWISHIYAT',
    sizeGuide: 'Taille Unique Ajustable (Outil de réglage offert dans le coffret)'
  };

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productFormData, setProductFormData] = useState(defaultProductFormData);
  const [modalTab, setModalTab] = useState('essentials'); // 'essentials', 'media', 'specs', 'descriptions'
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload', 'presets', 'url'

  const handleOpenAddProduct = () => {
    setIsEditingMode(false);
    setEditingProductId(null);
    setProductFormData({
      ...defaultProductFormData,
      image: (IMAGE_PRESETS && IMAGE_PRESETS[0] ? IMAGE_PRESETS[0].image : '')
    });
    setModalTab('essentials');
    setImageSourceMode('upload');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setIsEditingMode(true);
    setEditingProductId(prod.id);
    setProductFormData({
      name: prod.name || '',
      nameAr: prod.nameAr || '',
      category: prod.category || 'watches',
      gender: prod.gender || 'men',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || Math.round((prod.price || 0) * 1.35),
      stock: prod.stock !== undefined ? prod.stock : 10,
      badge: prod.badge || (prod.isBestSeller ? 'Best-Seller' : (prod.isNewArrival ? 'Nouveauté' : (prod.isFlashSale ? 'Vente Flash' : ''))),
      image: prod.image || '',
      gallery: prod.gallery || [],
      shortDescription: prod.shortDescription || '',
      shortDescriptionAr: prod.shortDescriptionAr || '',
      description: prod.description || '',
      descriptionAr: prod.descriptionAr || '',
      material: prod.specs?.['Matériau'] || 'Acier Inoxydable 316L & Placage Or 18K PVD',
      waterResistance: prod.specs?.['Étanchéité'] || '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)',
      glass: prod.specs?.['Verre'] || 'Saphir Inrayable traité antireflet',
      movement: prod.specs?.['Mouvement'] || 'Quartz Haute Précision Chronographe',
      dimensions: prod.specs?.['Diamètre'] || '41 mm (Épaisseur 11 mm)',
      warranty: prod.specs?.['Garantie'] || 'Garantie Or 1 An incluse avec carte TWISHIYAT',
      sizeGuide: prod.sizes?.[0] || 'Taille Unique Ajustable (Outil offert)'
    });
    setModalTab('essentials');
    setImageSourceMode('presets');
    setProductModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image trop volumineuse (maximum 5 Mo)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductFormData(prev => ({ ...prev, image: ev.target.result }));
      addToast('Photo principale chargée avec succès !');
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.slice(0, 3).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProductFormData(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []).slice(0, 3), ev.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
    addToast('Photo(s) additionnelle(s) ajoutée(s) à la galerie !');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      addToast('Veuillez renseigner le nom du produit.', 'error');
      return;
    }
    if (!productFormData.price || Number(productFormData.price) <= 0) {
      addToast('Veuillez spécifier un prix valide.', 'error');
      return;
    }

    const finalImage = productFormData.image || (products[0] ? products[0].image : (IMAGE_PRESETS[0] ? IMAGE_PRESETS[0].image : ''));
    const finalGallery = (productFormData.gallery && productFormData.gallery.length > 0)
      ? productFormData.gallery
      : [finalImage];

    const payload = {
      name: productFormData.name,
      nameAr: productFormData.nameAr || productFormData.name,
      category: productFormData.category,
      gender: productFormData.gender,
      price: Number(productFormData.price),
      originalPrice: Number(productFormData.originalPrice) || Math.round(Number(productFormData.price) * 1.35),
      stock: Number(productFormData.stock) || 10,
      badge: productFormData.badge,
      image: finalImage,
      gallery: finalGallery,
      shortDescription: productFormData.shortDescription || `${productFormData.name} - Sélection prestige TWISHIYAT.`,
      shortDescriptionAr: productFormData.shortDescriptionAr || '',
      description: productFormData.description || `Chef-d’œuvre d’accessoire inspiré du raffinement marocain. Livré dans son écrin de luxe TWISHIYAT avec certificat d’authenticité et garantie 1 an.`,
      descriptionAr: productFormData.descriptionAr || '',
      specs: {
        'Matériau': productFormData.material || 'Acier Inoxydable 316L & Finition Or 18K',
        'Étanchéité': productFormData.waterResistance || 'Water Resistant (Résiste à l’eau)',
        'Verre': productFormData.glass || 'Verre Saphir Inrayable',
        'Mouvement': productFormData.movement || 'Quartz Haute Précision',
        'Diamètre': productFormData.dimensions || '41 mm',
        'Garantie': productFormData.warranty || 'Garantie 1 An incluse'
      },
      sizes: [productFormData.sizeGuide || 'Taille Unique Ajustable']
    };

    if (isEditingMode && editingProductId) {
      updateProduct(editingProductId, payload);
      addToast(`Produit "${payload.name}" mis à jour avec succès !`);
    } else {
      addNewProduct(payload);
      addToast(`Nouveau produit "${payload.name}" ajouté avec succès au catalogue !`);
    }

    setProductModalOpen(false);
    setIsEditingMode(false);
    setEditingProductId(null);
  };

  const handleDeleteProduct = (prod) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le produit "${prod.name}" ?`)) {
      deleteProduct(prod.id);
      addToast(`Produit "${prod.name}" supprimé du catalogue.`);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim() !== '') {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendWhatsAppConfirmation = (ord) => {
    const text = `Salam ${ord.customer.fullName} ! C’est TWISHIYAT. Nous avons bien reçu votre commande N° ${ord.id} d'un montant de ${ord.total} DH. Confirmez-vous la livraison à ${ord.customer.city} (${ord.customer.address}) ?`;
    window.open(`https://wa.me/212${ord.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#F8F9FA' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '40px 32px', textAlign: 'center' }}>
          {/* Brand Logo */}
          <img
            src={brandLogo}
            alt="TWISHIYAT Logo"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--gold-500)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
              margin: '0 auto 20px auto',
              display: 'block',
              background: '#000000'
            }}
          />

          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-700)', fontWeight: '700' }}>
            Accès Réservé
          </span>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--obsidian-950)', margin: '8px 0 12px 0', fontFamily: 'var(--font-serif)' }}>
            Espace Pro TWISHIYAT
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '28px' }}>
            Veuillez entrer votre mot de passe pour accéder à la gestion des commandes, des livraisons et des stocks.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-900)', marginBottom: '6px' }}>
                Mot de Passe Administrateur
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
                  placeholder="Entrez votre mot de passe..."
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 40px',
                    borderRadius: '10px',
                    border: authError ? '1px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: '0.95rem',
                    outline: 'none',
                    background: '#FAF9F6'
                  }}
                />
                <KeyRound size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {authError && (
                <span style={{ display: 'block', color: '#DC2626', fontSize: '0.8rem', marginTop: '6px' }}>
                  Mot de passe incorrect. Veuillez réessayer.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', justifyContent: 'center' }}
            >
              <span>Déverrouiller l'Espace Pro</span>
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
            <button
              onClick={() => navigateTo('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.85rem', fontWeight: '500' }}
            >
              <Store size={15} />
              <span>Retour à la boutique publique</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 100px 0', background: '#F8F9FA' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={brandLogo}
              alt="TWISHIYAT"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--gold-500)',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)',
                background: '#000000',
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-gold">Espace Pro Sécurisé</span>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>TWISHIYAT Backoffice</span>
              </div>
              <h1 style={{ fontSize: '2rem', color: 'var(--obsidian-950)', margin: '4px 0' }}>
                Administration TWISHIYAT
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
                Gestion des commandes en espèces (COD), expéditions Amana/Cathedis et catalogue.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('home')}
              className="btn-outline"
              style={{ fontSize: '0.85rem', padding: '10px 16px' }}
              title="Retour au site public"
            >
              <Store size={16} />
              <span>Boutique Publique</span>
            </button>

            <button
              className="btn-gold"
              onClick={handleOpenAddProduct}
              style={{ fontSize: '0.85rem', padding: '10px 18px' }}
            >
              <Plus size={16} />
              <span>Nouveau Produit</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Fermer la session administrateur"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Real-time Moroccan eCommerce KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {/* Total Revenue */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chiffre d'Affaires Total
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                {kpis.totalSales.toLocaleString()} DH
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <TrendingUp size={13} /> +18.4% ce mois
            </span>
          </div>

          {/* Total Orders */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Commandes Reçues
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                {kpis.totalOrdersCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>commandes</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-700)', marginTop: '6px', display: 'block' }}>
              Panier moyen : <strong>{kpis.avgOrderValue} DH</strong>
            </span>
          </div>

          {/* COD Confirmation Rate */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Taux Confirmation COD
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669' }}>
                {kpis.codConfirmationRate}%
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '6px', display: 'block' }}>
              {kpis.pendingCount} commandes à appeler aujourd'hui
            </span>
          </div>

          {/* Logistics In Transit */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Colis En Cours de Livraison
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold-600)' }}>
                {kpis.shippedCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>en route</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', marginTop: '6px', display: 'block' }}>
              {kpis.deliveredCount} colis livrés et encaissés
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
          {[
            { id: 'orders', label: `Gestion des Commandes (${orders.length})` },
            { id: 'products', label: `Catalogue Produits (${products.length})` },
            { id: 'coupons', label: `Codes Promo & Offres (${coupons.length})` },
            { id: 'reviews', label: `Modération Avis (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.9rem',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--obsidian-800)',
                background: activeTab === tab.id ? 'var(--obsidian-900)' : '#FFFFFF',
                border: '1px solid #E5E7EB',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {/* Filter Toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Rechercher par N°, nom, ville..."
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'pending_confirmation', label: 'À Confirmer' },
                  { id: 'confirmed', label: 'Confirmées' },
                  { id: 'shipped', label: 'Expédiées' },
                  { id: 'delivered', label: 'Livrées' },
                  { id: 'cancelled', label: 'Annulées' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: orderStatusFilter === st.id ? 'var(--gold-50)' : '#F9FAFB',
                      color: orderStatusFilter === st.id ? 'var(--gold-800)' : '#4B5563',
                      border: orderStatusFilter === st.id ? '1px solid var(--gold-500)' : '1px solid #E5E7EB'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#FAF8F5', borderBottom: '1px solid #E5E7EB', color: '#6B7280', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Commande</th>
                    <th style={{ padding: '14px 20px' }}>Client & Contact</th>
                    <th style={{ padding: '14px 20px' }}>Ville & Adresse</th>
                    <th style={{ padding: '14px 20px' }}>Articles & Montant</th>
                    <th style={{ padding: '14px 20px' }}>Statut Expédition</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }}>
                      {/* Order ID & Date */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--obsidian-900)', display: 'block' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {new Date(ord.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--obsidian-900)', display: 'block' }}>
                          {ord.customer.fullName}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{ color: 'var(--gold-800)', fontWeight: '600' }}>
                            {ord.customer.phone}
                          </span>
                          <button
                            onClick={() => handleSendWhatsAppConfirmation(ord)}
                            style={{ background: '#25D366', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            title="Envoyer message WhatsApp de confirmation"
                          >
                            <Phone size={10} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>

                      {/* City & Address */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--obsidian-900)', display: 'block' }}>
                          📍 {ord.customer.city}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280', display: 'block', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ord.customer.address}
                        </span>
                      </td>

                      {/* Articles & Amount */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--obsidian-950)', display: 'block' }}>
                          {ord.total} DH
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {ord.items.length} article(s) • Espèces COD
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid #D1D5DB',
                            background: ord.status === 'delivered' ? '#ECFDF5' : (ord.status === 'pending_confirmation' ? '#FFFBEB' : '#FFFFFF'),
                            color: ord.status === 'delivered' ? '#065F46' : (ord.status === 'pending_confirmation' ? '#B45309' : 'var(--obsidian-900)'),
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending_confirmation">À confirmer (Appel)</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="processing">En préparation</option>
                          <option value="shipped">Expédiée (Transit)</option>
                          <option value="out_for_delivery">En cours de livraison</option>
                          <option value="delivered">Livrée & Encaissée</option>
                          <option value="cancelled">Annulée / Retour</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setPrintableSlipOrder(ord)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--obsidian-900)'
                          }}
                          title="Imprimer le bordereau d'expédition"
                        >
                          <Printer size={13} />
                          <span>Bordereau</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-900)', fontWeight: '700' }}>
                  Catalogue Produits & Stocks ({products.length})
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>
                  Ajoutez, personnalisez les caractéristiques ou modifiez les tarifs en direct.
                </p>
              </div>
              <button 
                className="btn-gold" 
                onClick={handleOpenAddProduct} 
                style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                <span>Nouveau Produit</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {products.map((p) => {
                const discount = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return (
                  <div 
                    key={p.id} 
                    style={{ 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '12px', 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                        <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #F3F4F6' }} 
                          />
                          {p.badge && (
                            <span 
                              style={{ 
                                position: 'absolute', 
                                top: '-6px', 
                                left: '-6px', 
                                background: 'var(--gold-500)', 
                                color: 'var(--obsidian-950)', 
                                fontSize: '0.65rem', 
                                fontWeight: '700', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.id}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--gold-700)', fontWeight: '600', textTransform: 'uppercase' }}>• {p.category}</span>
                          </div>
                          <h4 style={{ fontWeight: '700', color: 'var(--obsidian-900)', fontSize: '0.92rem', marginBottom: '4px', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--gold-800)', fontSize: '1.05rem' }}>
                              {p.price} DH
                            </span>
                            {p.originalPrice > p.price && (
                              <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.78rem' }}>
                                {p.originalPrice} DH
                              </span>
                            )}
                            {discount > 0 && (
                              <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '0.68rem', fontWeight: '700', padding: '1px 5px', borderRadius: '4px' }}>
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fast Inline Edit Fields */}
                      <div style={{ background: '#F9FAFB', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Prix (DH)</label>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                            style={{ width: '80px', padding: '4px 8px', borderRadius: '5px', border: '1px solid #D1D5DB', fontWeight: 'bold', background: '#FFFFFF', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Stock Casa</label>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })}
                            style={{ width: '70px', padding: '4px 8px', borderRadius: '5px', border: '1px solid #D1D5DB', fontWeight: 'bold', background: '#FFFFFF', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>État</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: p.stock > 0 ? '#059669' : '#DC2626' }}>
                            {p.stock > 0 ? '✓ En Stock' : '✕ Rupture'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-gold)',
                          background: 'rgba(212, 175, 55, 0.08)',
                          color: 'var(--gold-800)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => navigateTo('product', p.id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                          background: '#FFFFFF',
                          color: '#4B5563',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer'
                        }}
                        title="Voir la fiche produit sur la boutique"
                      >
                        <Eye size={13} />
                        <span>Voir</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #FEE2E2',
                          background: '#FFF5F5',
                          color: '#DC2626',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Supprimer ce produit"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--obsidian-900)', marginBottom: '16px' }}>Codes Promotionnels Actifs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {coupons.map((c) => (
                <div key={c.code} style={{ border: '1.5px dashed var(--gold-500)', borderRadius: '10px', padding: '18px', background: 'var(--gold-50)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--obsidian-950)' }}>{c.code}</span>
                    <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>Actif</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: '4px 0' }}>
                    {c.type === 'percentage' ? `-${c.value}% de réduction immédiate` : 'Livraison gratuite partout au Maroc'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Utilisé {c.uses} fois</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--obsidian-900)', marginBottom: '16px' }}>Avis Clients Vérifiés ({reviews.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{r.customerName} (📍 {r.city})</strong>
                      <span style={{ color: '#F59E0B', fontSize: '0.8rem' }}>★ {r.rating}/5</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: '2px 0' }}>"{r.comment}"</p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{r.date}</span>
                  </div>
                  <span style={{ background: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                    Approuvé
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE MOROCCAN SHIPPING SLIP MODAL (Bordereau d'expédition) */}
      {printableSlipOrder && (
        <div className="modal-overlay" onClick={() => setPrintableSlipOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--obsidian-900)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={brandLogo}
                  alt="TWISHIYAT"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #000',
                    background: '#000'
                  }}
                />
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>TWISHIYAT</h2>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Bordereau d'Expédition & Encaissement COD</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{printableSlipOrder.id}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280' }}>Colis Express Maroc</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '6px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#6B7280' }}>EXPÉDITEUR :</strong>
                TWISHIYAT - Expéditions Maroc<br />
                Bd Al Massira, Maarif, Casablanca<br />
                Tél : 07 08 75 95 10
              </div>
              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '6px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#6B7280' }}>DESTINATAIRE :</strong>
                <strong>{printableSlipOrder.customer.fullName}</strong><br />
                {printableSlipOrder.customer.address}<br />
                <strong>{printableSlipOrder.customer.city}</strong><br />
                Tél : <strong>{printableSlipOrder.customer.phone}</strong>
              </div>
            </div>

            <div style={{ border: '2px dashed var(--gold-600)', background: 'var(--gold-50)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase' }}>MONTANT TOTAL À ENCAISSER EN ESPÈCES :</span>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--obsidian-950)' }}>
                {printableSlipOrder.total} DH
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669' }}>Le client a le droit d'ouvrir le colis avant paiement.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-dark" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Imprimer le Bordereau</span>
              </button>
              <button className="btn-outline" onClick={() => setPrintableSlipOrder(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PRODUCT CREATION & EDITION MODAL */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div 
            className="modal-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '780px', 
              width: '95%', 
              maxHeight: '90vh', 
              padding: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            {/* Modal Header */}
            <div style={{ background: 'var(--obsidian-950)', color: '#FFFFFF', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--gold-500)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--gold-400)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF', fontFamily: 'var(--font-serif)', letterSpacing: '0.04em' }}>
                    {isEditingMode ? `Modifier : ${productFormData.name || 'Produit'}` : 'Nouveau Produit — TWISHIYAT'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '2px' }}>
                  Configurez les caractéristiques complètes (photos, tarifs barrés, fiche technique, bilingue).
                </p>
              </div>
              <button 
                onClick={() => setProductModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0 16px', overflowX: 'auto' }}>
              {[
                { id: 'essentials', label: '1. Essentiel & Tarifs', icon: Tag },
                { id: 'media', label: '2. Photos & Médias', icon: ImageIcon },
                { id: 'specs', label: '3. Fiche Technique', icon: ShieldCheck },
                { id: 'descriptions', label: '4. Descriptions & Arabe', icon: FileText }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id)}
                    style={{
                      padding: '14px 18px',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '3px solid var(--gold-500)' : '3px solid transparent',
                      color: isActive ? 'var(--obsidian-950)' : '#64748B',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    <IconComp size={16} color={isActive ? 'var(--gold-600)' : '#94A3B8'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px 28px', flexGrow: 1, overflowY: 'auto' }}>

                {/* TAB 1: ESSENTIEL & TARIFS */}
                {modalTab === 'essentials' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '6px' }}>
                        Nom du produit (Français) *
                      </label>
                      <input
                        type="text"
                        required
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        placeholder="ex: Montre Royale Chronographe Saphir Or 18K"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.92rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '6px' }}>
                          Catégorie
                        </label>
                        <select
                          value={productFormData.category}
                          onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="watches">Montres de Précision</option>
                          <option value="bracelets">Bracelets & Joncs Ciselés</option>
                          <option value="rings">Bagues & Chevalières</option>
                          <option value="sets">Coffrets Cadeaux & Ensembles</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '6px' }}>
                          Public Cible / Genre
                        </label>
                        <select
                          value={productFormData.gender}
                          onChange={(e) => setProductFormData({ ...productFormData, gender: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="men">Homme</option>
                          <option value="women">Femme</option>
                          <option value="unisex">Unisexe / Mixte</option>
                        </select>
                      </div>
                    </div>

                    {/* Pricing and Stock Grid */}
                    <div style={{ background: '#FAF8F5', border: '1px solid #EFEAE2', padding: '16px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-800)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                        Tarifs & Disponibilité (Dirhams Marocains)
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                            Prix de Vente Réel (DH) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={productFormData.price}
                            onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontWeight: 'bold', fontSize: '1rem', color: 'var(--gold-900)', background: '#FFFFFF' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                            Prix d'Origine Barré (DH)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={productFormData.originalPrice}
                            onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                            placeholder="ex: 599"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '1rem', background: '#FFFFFF' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                            Stock Casablanca
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={productFormData.stock}
                            onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '1rem', background: '#FFFFFF' }}
                          />
                        </div>
                      </div>

                      {Number(productFormData.originalPrice) > Number(productFormData.price) && (
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#059669', fontWeight: '600' }}>
                          <Percent size={14} />
                          <span>
                            Réduction affichée sur la boutique : <strong>-{Math.round(((Number(productFormData.originalPrice) - Number(productFormData.price)) / Number(productFormData.originalPrice)) * 100)}% d'économie</strong> pour le client !
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Marketing Badge & Size */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '6px' }}>
                          Badge Promotionnel / Marketing
                        </label>
                        <select
                          value={productFormData.badge}
                          onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="">Aucun badge</option>
                          <option value="Best-Seller">⭐ Best-Seller</option>
                          <option value="Nouveauté">✨ Nouveauté 2026</option>
                          <option value="Édition Limitée">👑 Édition Limitée</option>
                          <option value="Vente Flash">🔥 Vente Flash</option>
                          <option value="Coup de Cœur">❤️ Coup de Cœur</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '6px' }}>
                          Ajustement & Tailles
                        </label>
                        <input
                          type="text"
                          value={productFormData.sizeGuide}
                          onChange={(e) => setProductFormData({ ...productFormData, sizeGuide: e.target.value })}
                          placeholder="ex: Taille Unique Ajustable (Outil offert)"
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHOTOS & MÉDIAS */}
                {modalTab === 'media' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '8px' }}>
                        Image Principale du Produit
                      </label>

                      {/* Source selector buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                        <button
                          type="button"
                          onClick={() => setImageSourceMode('upload')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: imageSourceMode === 'upload' ? '1px solid var(--gold-600)' : '1px solid #D1D5DB',
                            background: imageSourceMode === 'upload' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'upload' ? 'var(--gold-800)' : '#4B5563',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={14} />
                          <span>Uploader depuis appareil</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImageSourceMode('presets')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: imageSourceMode === 'presets' ? '1px solid var(--gold-600)' : '1px solid #D1D5DB',
                            background: imageSourceMode === 'presets' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'presets' ? 'var(--gold-800)' : '#4B5563',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <ImageIcon size={14} />
                          <span>Photos TWISHIYAT</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImageSourceMode('url')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: imageSourceMode === 'url' ? '1px solid var(--gold-600)' : '1px solid #D1D5DB',
                            background: imageSourceMode === 'url' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'url' ? 'var(--gold-800)' : '#4B5563',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <ExternalLink size={14} />
                          <span>Lien URL Web</span>
                        </button>
                      </div>

                      {/* Mode 1: Upload */}
                      {imageSourceMode === 'upload' && (
                        <div style={{ border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '24px', textAlign: 'center', background: '#F8FAFC', marginBottom: '14px' }}>
                          <Upload size={32} color="var(--gold-500)" style={{ margin: '0 auto 8px auto' }} />
                          <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--obsidian-900)', marginBottom: '4px' }}>
                            Prendre une photo ou sélectionner depuis vos fichiers
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '12px' }}>
                            Compatible Mobile, iPhone, Android, PC (JPG, PNG, WEBP max 5 Mo)
                          </span>
                          <label className="btn-dark" style={{ padding: '8px 18px', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>Parcourir mon appareil</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                      )}

                      {/* Mode 2: Presets */}
                      {imageSourceMode === 'presets' && (
                        <div style={{ marginBottom: '14px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                            Cliquez sur une photo pour l’assigner instantanément à ce produit :
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                            {IMAGE_PRESETS.map((preset) => {
                              const isSelected = productFormData.image === preset.image;
                              return (
                                <div
                                  key={preset.id}
                                  onClick={() => setProductFormData({ ...productFormData, image: preset.image })}
                                  style={{
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: isSelected ? '3px solid var(--gold-500)' : '1px solid #E2E8F0',
                                    boxShadow: isSelected ? '0 0 0 2px var(--gold-300)' : 'none',
                                    position: 'relative'
                                  }}
                                  title={preset.label}
                                >
                                  <img src={preset.image} alt={preset.label} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                  {isSelected && (
                                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--gold-500)', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Check size={12} strokeWidth={3} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Mode 3: URL */}
                      {imageSourceMode === 'url' && (
                        <div style={{ marginBottom: '14px' }}>
                          <input
                            type="url"
                            value={productFormData.image}
                            onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                            placeholder="https://exemple.com/photos/montre.jpg"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                          />
                        </div>
                      )}

                      {/* Live Image Preview Card */}
                      {productFormData.image && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                          <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                            <img src={productFormData.image} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            {productFormData.badge && (
                              <span style={{ position: 'absolute', top: '-4px', left: '-4px', background: 'var(--gold-500)', color: '#000', fontSize: '0.62rem', fontWeight: 'bold', padding: '2px 5px', borderRadius: '3px' }}>
                                {productFormData.badge}
                              </span>
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--obsidian-950)', display: 'block' }}>
                              Aperçu photo produit
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
                              ✓ Image prête pour l'affichage en boutique et publicités
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Gallery */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
                            Galerie Photos Additionnelles (Angles différents)
                          </label>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                            Permet aux clients de faire défiler plusieurs photos au poignet ou dans l'écrin
                          </span>
                        </div>
                        <label className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Plus size={14} />
                          <span>Ajouter des photos</span>
                          <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {productFormData.gallery && productFormData.gallery.length > 0 ? (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {productFormData.gallery.map((imgUrl, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                              <img src={imgUrl} alt={`Galerie ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => setProductFormData({
                                  ...productFormData,
                                  gallery: productFormData.gallery.filter((_, i) => i !== idx)
                                })}
                                style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                          Aucune photo additionnelle. La photo principale sera dupliquée par défaut.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: FICHE TECHNIQUE & SPECS */}
                {modalTab === 'specs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                      Ces caractéristiques s'affichent dans l'onglet <strong>Fiche Technique</strong> du produit pour rassurer les clients et lever les doutes avant l'achat :
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Matériau & Finition
                        </label>
                        <input
                          type="text"
                          value={productFormData.material}
                          onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                          placeholder="ex: Acier Inoxydable 316L & Placage Or 18K PVD"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Étanchéité (Water Resistance)
                        </label>
                        <input
                          type="text"
                          value={productFormData.waterResistance}
                          onChange={(e) => setProductFormData({ ...productFormData, waterResistance: e.target.value })}
                          placeholder="ex: 5 ATM / 50 Mètres (Résiste aux ablutions)"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Type de Verre
                        </label>
                        <input
                          type="text"
                          value={productFormData.glass}
                          onChange={(e) => setProductFormData({ ...productFormData, glass: e.target.value })}
                          placeholder="ex: Saphir Inrayable traité antireflet"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Mouvement / Mécanisme
                        </label>
                        <input
                          type="text"
                          value={productFormData.movement}
                          onChange={(e) => setProductFormData({ ...productFormData, movement: e.target.value })}
                          placeholder="ex: Quartz Haute Précision Chronographe"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Diamètre & Dimensions
                        </label>
                        <input
                          type="text"
                          value={productFormData.dimensions}
                          onChange={(e) => setProductFormData({ ...productFormData, dimensions: e.target.value })}
                          placeholder="ex: 41 mm (Épaisseur 11 mm)"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                          Garantie Incluse
                        </label>
                        <input
                          type="text"
                          value={productFormData.warranty}
                          onChange={(e) => setProductFormData({ ...productFormData, warranty: e.target.value })}
                          placeholder="ex: Garantie Or 1 An incluse avec carte TWISHIYAT"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: DESCRIPTIONS & BILINGUE */}
                {modalTab === 'descriptions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                        Accroche Courte (1-2 phrases affichées sous le titre)
                      </label>
                      <input
                        type="text"
                        value={productFormData.shortDescription}
                        onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                        placeholder="ex: Chronographe d’exception avec cadran vert soleillé et finitions dorées 18k."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--obsidian-900)', display: 'block', marginBottom: '4px' }}>
                        Description Détaillée du Produit
                      </label>
                      <textarea
                        rows={3}
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                        placeholder="Détaillez les inspirations, le confort au poignet, les finitions et le contenu du coffret cadeau..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>

                    {/* Arabic Fields */}
                    <div style={{ background: '#FAF8F5', border: '1px solid #EFEAE2', padding: '16px', borderRadius: '10px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-800)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                        🇲🇦 Version en Langue Arabe (Optionnel)
                      </span>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                            Nom du produit en Arabe (اسم المنتج)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={productFormData.nameAr}
                            onChange={(e) => setProductFormData({ ...productFormData, nameAr: e.target.value })}
                            placeholder="ساعة ملكية فاخرة مطلية بالذهب 18 قيراط"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', textAlign: 'right' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                            Description en Arabe (وصف المنتج)
                          </label>
                          <textarea
                            rows={2}
                            dir="rtl"
                            value={productFormData.descriptionAr}
                            onChange={(e) => setProductFormData({ ...productFormData, descriptionAr: e.target.value })}
                            placeholder="تحفة استثنائية مستوحاة من الأناقة المغربية العصرية..."
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', textAlign: 'right', fontFamily: 'inherit', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer (Sticky bottom) */}
              <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 28px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {modalTab === 'essentials' && 'Étape 1 sur 4 : Tarifs & Essentiel'}
                  {modalTab === 'media' && 'Étape 2 sur 4 : Photos & Galerie'}
                  {modalTab === 'specs' && 'Étape 3 sur 4 : Fiche Horlogère'}
                  {modalTab === 'descriptions' && 'Étape 4 sur 4 : Textes & Bilingue'}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setProductModalOpen(false)}
                    style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '9px 24px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Check size={16} />
                    <span>{isEditingMode ? 'Mettre à Jour le Produit' : 'Enregistrer le Produit'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
