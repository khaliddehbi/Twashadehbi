import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import brandLogo from '../../assets/images/logo.png';
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
  Percent,
  Copy,
  LayoutGrid,
  Bell,
  Headphones,
  Share2,
  Receipt,
  BarChart3,
  Sliders,
  Package,
  Home,
  Menu,
  ChevronRight,
  ArrowUpRight,
  Layers,
  HelpCircle,
  Globe
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

  const { addToast, navigateTo, language, setLanguage } = useStore();

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

  // Navigation & UI States
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'upsells', 'coupons', 'customers', 'insights', 'reviews'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardPeriod, setDashboardPeriod] = useState('today'); // 'today', 'week', 'month', 'year'
  const [newVersionToggle, setNewVersionToggle] = useState(true);

  // Product Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all', 'in_stock', 'low_stock', 'out_of_stock'

  // Order Filters & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [printableSlipOrder, setPrintableSlipOrder] = useState(null);

  // Product Modal State
  const defaultProductFormData = {
    name: '',
    nameAr: '',
    category: 'watches',
    gender: 'men',
    price: 349,
    originalPrice: 499,
    stock: 12,
    badge: 'Best-Seller',
    image: (IMAGE_PRESETS && IMAGE_PRESETS[0] ? IMAGE_PRESETS[0].image : ''),
    gallery: [],
    shortDescription: '',
    shortDescriptionAr: '',
    description: '',
    descriptionAr: '',
    material: 'Alliage Haute Résistance & Finition Dorée Haute Précision',
    waterResistance: '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)',
    glass: 'Saphir Inrayable traité antireflet',
    movement: 'Quartz Haute Précision Chronographe',
    dimensions: '41 mm (Épaisseur 11 mm)',
    warranty: 'Garantie Prestige 1 An incluse avec carte TWISHIYAT',
    sizeGuide: 'Taille Unique Ajustable (Outil de réglage offert dans le coffret)'
  };

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productFormData, setProductFormData] = useState(defaultProductFormData);
  const [modalTab, setModalTab] = useState('general'); // 'general', 'media', 'specs', 'descriptions'
  const [imageSourceMode, setImageSourceMode] = useState('presets'); // 'presets', 'upload', 'url'

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  // Authentication Handlers
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

  // Product Handlers
  const handleOpenAddProduct = () => {
    setIsEditingMode(false);
    setEditingProductId(null);
    setProductFormData({
      ...defaultProductFormData,
      image: (IMAGE_PRESETS && IMAGE_PRESETS[0] ? IMAGE_PRESETS[0].image : '')
    });
    setModalTab('general');
    setImageSourceMode('presets');
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
      image: prod.image || (IMAGE_PRESETS[0] ? IMAGE_PRESETS[0].image : ''),
      gallery: prod.gallery || [],
      shortDescription: prod.shortDescription || '',
      shortDescriptionAr: prod.shortDescriptionAr || '',
      description: prod.description || '',
      descriptionAr: prod.descriptionAr || '',
      material: prod.specs?.['Matériau'] || 'Alliage Haute Résistance & Finition Dorée Haute Précision',
      waterResistance: prod.specs?.['Étanchéité'] || '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)',
      glass: prod.specs?.['Verre'] || 'Saphir Inrayable traité antireflet',
      movement: prod.specs?.['Mouvement'] || 'Quartz Haute Précision Chronographe',
      dimensions: prod.specs?.['Diamètre'] || '41 mm (Épaisseur 11 mm)',
      warranty: prod.specs?.['Garantie'] || 'Garantie Prestige 1 An incluse avec carte TWISHIYAT',
      sizeGuide: prod.sizes?.[0] || 'Taille Unique Ajustable (Outil offert)'
    });
    setModalTab('general');
    setImageSourceMode('presets');
    setProductModalOpen(true);
  };

  const handleDuplicateProduct = (prod) => {
    const clonedPayload = {
      name: `${prod.name} (Copie)`,
      nameAr: prod.nameAr ? `${prod.nameAr} (نسخة)` : `${prod.name} (نسخة)`,
      category: prod.category || 'watches',
      gender: prod.gender || 'men',
      price: Number(prod.price) || 0,
      originalPrice: Number(prod.originalPrice) || Math.round(Number(prod.price) * 1.35),
      stock: Number(prod.stock) || 10,
      badge: prod.badge || '',
      image: prod.image,
      gallery: prod.gallery ? [...prod.gallery] : [prod.image],
      shortDescription: prod.shortDescription || '',
      shortDescriptionAr: prod.shortDescriptionAr || '',
      description: prod.description || '',
      descriptionAr: prod.descriptionAr || '',
      specs: prod.specs || {
        'Matériau': 'Alliage Haute Résistance & Finition Dorée Haute Précision',
        'Étanchéité': '5 ATM / 50 Mètres (Résiste aux ablutions)',
        'Verre': 'Saphir Inrayable traité antireflet',
        'Garantie': 'Garantie Prestige 1 An'
      },
      sizes: prod.sizes || ['Taille Unique Ajustable']
    };

    addNewProduct(clonedPayload);
    addToast(`Produit dupliqué avec succès : "${clonedPayload.name}"`);
  };

  const handleQuickStockChange = (prodId, delta) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    updateProduct(prodId, { stock: newStock });
    addToast(`Stock mis à jour pour ${prod.name} : ${newStock} unités.`);
  };

  const compressImage = (file, maxDim = 800, quality = 0.82) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.82);
      if (compressed) {
        setProductFormData(prev => ({ ...prev, image: compressed }));
        addToast('Photo principale chargée et optimisée pour la boutique !');
      }
    } catch (err) {
      addToast('Erreur lors du traitement de l’image.', 'error');
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    if (!files.length) return;
    try {
      const compressedList = await Promise.all(files.map(f => compressImage(f, 800, 0.82)));
      const valid = compressedList.filter(Boolean);
      setProductFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []).slice(0, 3), ...valid].slice(0, 4)
      }));
      addToast('Photo(s) additionnelle(s) optimisée(s) et ajoutée(s) à la galerie !');
    } catch (err) {
      addToast('Erreur lors de l’ajout des photos.', 'error');
    }
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
      name: productFormData.name.trim(),
      nameAr: productFormData.nameAr.trim() || productFormData.name.trim(),
      category: productFormData.category,
      gender: productFormData.gender,
      price: Number(productFormData.price),
      originalPrice: Number(productFormData.originalPrice) || Math.round(Number(productFormData.price) * 1.35),
      stock: Number(productFormData.stock) >= 0 ? Number(productFormData.stock) : 10,
      badge: productFormData.badge,
      image: finalImage,
      gallery: finalGallery,
      shortDescription: productFormData.shortDescription || `${productFormData.name} - Sélection prestige TWISHIYAT.`,
      shortDescriptionAr: productFormData.shortDescriptionAr || '',
      description: productFormData.description || `Chef-d’œuvre d’accessoire inspiré du raffinement marocain. Livré dans son écrin de luxe TWISHIYAT avec certificat d’authenticité et garantie 1 an.`,
      descriptionAr: productFormData.descriptionAr || '',
      specs: {
        'Matériau': productFormData.material || 'Alliage Haute Résistance & Finition Dorée Haute Précision',
        'Étanchéité': productFormData.waterResistance || '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)',
        'Verre': productFormData.glass || 'Verre Saphir Inrayable traité antireflet',
        'Mouvement': productFormData.movement || 'Quartz Haute Précision Chronographe',
        'Diamètre': productFormData.dimensions || '41 mm (Épaisseur 11 mm)',
        'Garantie': productFormData.warranty || 'Garantie Prestige 1 An incluse avec carte TWISHIYAT'
      },
      sizes: [productFormData.sizeGuide || 'Taille Unique Ajustable (Outil offert)']
    };

    if (isEditingMode && editingProductId) {
      updateProduct(editingProductId, payload);
      addToast(`Produit "${payload.name}" mis à jour avec succès !`);
    } else {
      addNewProduct(payload);
      addToast(`Nouveau produit "${payload.name}" ajouté avec succès au catalogue !`);
    }

    // Reset filters to guarantee the product is visible in the list
    setProductSearch('');
    setProductCategoryFilter('all');
    setProductStockFilter('all');

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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }
      // Stock filter
      if (productStockFilter === 'in_stock' && (p.stock || 0) <= 3) return false;
      if (productStockFilter === 'low_stock' && ((p.stock || 0) <= 0 || (p.stock || 0) > 3)) return false;
      if (productStockFilter === 'out_of_stock' && (p.stock || 0) > 0) return false;

      // Search query
      if (productSearch.trim() !== '') {
        const q = productSearch.toLowerCase();
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearch]);

  // Product KPI summary counts
  const productStats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => (p.stock || 0) > 3).length;
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 3).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const totalInventoryValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    return { total, inStock, lowStock, outOfStock, totalInventoryValue };
  }, [products]);

  // Unique Customers extracted from Orders
  const customersList = useMemo(() => {
    const map = new Map();
    orders.forEach((ord) => {
      const phone = ord.customer.phone;
      if (!map.has(phone)) {
        map.set(phone, {
          fullName: ord.customer.fullName,
          phone: ord.customer.phone,
          city: ord.customer.city,
          address: ord.customer.address,
          totalSpent: ord.total || 0,
          ordersCount: 1,
          lastOrderDate: ord.date
        });
      } else {
        const existing = map.get(phone);
        existing.totalSpent += (ord.total || 0);
        existing.ordersCount += 1;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
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
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const handleSendWhatsAppConfirmation = (ord) => {
    const text = `Salam ${ord.customer.fullName} ! C’est TWISHIYAT. Nous avons bien reçu votre commande N° ${ord.id} d'un montant de ${ord.total} DH. Confirmez-vous la livraison à ${ord.customer.city} (${ord.customer.address}) ?`;
    window.open(`https://wa.me/212${ord.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (when not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%)' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', padding: '44px 36px', textAlign: 'center', position: 'relative' }}>
          
          {/* Brand Logo & Name */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '20px' }}>
            <img
              src={brandLogo}
              alt="TWISHIYAT Logo"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--gold-500)',
                boxShadow: '0 0 24px rgba(212, 175, 55, 0.4)',
                margin: '0 auto',
                display: 'block',
                background: '#F7F3EC'
              }}
            />
          </div>

          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold-700)', fontWeight: '800', display: 'block' }}>
            Espace Pro & Gestion
          </span>
          <h1 style={{ fontSize: '1.8rem', color: '#0F172A', margin: '6px 0 10px 0', fontFamily: 'var(--font-serif)', fontWeight: '800' }}>
            TWISHIYAT Admin
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '28px' }}>
            Accès sécurisé réservé à l’équipe TWISHIYAT pour gérer les produits, commandes et stocks.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
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
                    padding: '13px 16px 13px 42px',
                    borderRadius: '12px',
                    border: authError ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    background: '#F8FAFC',
                    transition: 'all 0.2s'
                  }}
                />
                <KeyRound size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {authError && (
                <span style={{ display: 'block', color: '#EF4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: '500' }}>
                  Mot de passe incorrect. Veuillez réessayer.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', justifyContent: 'center', borderRadius: '12px', fontWeight: '700' }}
            >
              <span>Accéder à l'Espace Pro</span>
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
            <button
              onClick={() => navigateTo('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Store size={15} />
              <span>Retour à la boutique publique TWISHIYAT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODERN SAAS BACKOFFICE PORTAL (Matching Screenshot)
  // -------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC', color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
      
      {/* 1. DARK NAVY SIDEBAR */}
      <aside 
        style={{ 
          width: sidebarOpen ? '240px' : '72px', 
          background: '#111827', 
          color: '#94A3B8', 
          display: 'flex', 
          flexDirection: 'column', 
          flexShrink: 0,
          borderRight: '1px solid #1F2937',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 40,
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        {/* Brand / Logo Header */}
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', borderBottom: '1px solid #1F2937' }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Réduire / Agrandir le menu"
          >
            <Menu size={20} />
          </button>
          
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '900', color: '#EF4444', letterSpacing: '0.04em', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>
                Twishiyat
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ flexGrow: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'orders', label: 'Orders', icon: Package, badge: orders.length > 0 ? orders.length : null, badgeColor: '#0EA5E9' },
            { id: 'products', label: 'Products', icon: Tag, badge: products.length, badgeColor: '#374151' },
            { id: 'upsells', label: 'Up Sells', icon: TrendingUp },
            { id: 'coupons', label: 'Coupons', icon: Percent },
            { id: 'customers', label: 'Customers', icon: Users, badge: customersList.length, badgeColor: '#374151' },
            { id: 'store', label: 'Store', icon: Store, isStoreLink: true },
            { id: 'insights', label: 'Insights', icon: BarChart3 },
            { id: 'invoices', label: 'Invoices', icon: Receipt },
            { id: 'reviews', label: 'Reviews', icon: Star, badge: reviews.length, badgeColor: '#374151' },
            { id: 'apps', label: 'Apps', icon: LayoutGrid },
            { id: 'affiliate', label: 'Affiliate', icon: Share2 },
            { id: 'support', label: 'Support', icon: Headphones }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isStoreLink) {
                    navigateTo('home');
                  } else {
                    setActiveNav(item.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  gap: '12px',
                  padding: sidebarOpen ? '10px 14px' : '10px 0',
                  borderRadius: '10px',
                  background: isActive ? '#1F2937' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.88rem',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={19} color={isActive ? '#F8FAFC' : '#9CA3AF'} style={{ flexShrink: 0 }} />
                
                {sidebarOpen && (
                  <span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {sidebarOpen && item.badge !== undefined && item.badge !== null && (
                  <span 
                    style={{ 
                      background: item.badgeColor || '#374151', 
                      color: '#FFFFFF', 
                      fontSize: '0.72rem', 
                      fontWeight: '700', 
                      padding: '2px 7px', 
                      borderRadius: '999px',
                      lineHeight: '1'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1F2937' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#F87171',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: '600',
              width: '100%'
            }}
            title="Se déconnecter"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* TOP METRIC & UTILITY BAR (Matching Screenshot) */}
        <header 
          style={{ 
            height: '64px', 
            background: '#FFFFFF', 
            borderBottom: '1px solid #E2E8F0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          {/* Left Metrics (AI Credit, Balance, Due Amount, Plan) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '500' }}>AI Credit</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#F59E0B" /> 0
              </span>
            </div>

            <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '500' }}>Balance</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10B981' }}>
                $ 1.00
              </span>
            </div>

            <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '500' }}>Due Amount</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#EF4444' }}>
                $ 0.17
              </span>
            </div>

            <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748B' }}>Your plan :</span>
              <span style={{ fontWeight: '700', color: '#1E293B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                💎 Default
              </span>
              <button 
                onClick={() => addToast('Vous bénéficiez du plan PRO TWISHIYAT ILLIMITÉ !')}
                style={{ background: 'none', border: 'none', color: '#9333EA', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
              >
                Upgrade now
              </button>
            </div>
          </div>

          {/* Right Controls (Store Link, AI, Language, Apps, Notifs, Profile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigateTo('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Voir la boutique publique"
            >
              <ExternalLink size={14} />
              <span>Voir la boutique</span>
            </button>

            {/* AI sparkle badge */}
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Assistant IA TWISHIYAT">
              <Sparkles size={16} color="#A855F7" />
            </div>

            {/* Language toggle */}
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFF7ED', color: '#EA580C', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
              title="Changer de langue"
            >
              {language.toUpperCase()}
            </button>

            {/* Grid button */}
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}>
              <LayoutGrid size={16} />
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                0
              </span>
            </div>

            {/* User Profile */}
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#1E293B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
              T
            </div>
          </div>
        </header>

        {/* 3. CONTENT AREA */}
        <div style={{ flexGrow: 1, padding: '32px' }}>

          {/* ======================================================== */}
          {/* VIEW: DASHBOARD (Overview)                               */}
          {/* ======================================================== */}
          {activeNav === 'dashboard' && (
            <div>
              {/* Welcome Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Welcome back <span style={{ color: '#BE185D' }}>TWISHIYAT</span>,
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>New version</span>
                  <div 
                    onClick={() => setNewVersionToggle(!newVersionToggle)}
                    style={{ 
                      width: '44px', 
                      height: '24px', 
                      borderRadius: '999px', 
                      background: newVersionToggle ? '#0284C7' : '#CBD5E1', 
                      cursor: 'pointer', 
                      position: 'relative',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        background: '#FFFFFF', 
                        position: 'absolute', 
                        top: '2px', 
                        left: newVersionToggle ? '22px' : '2px', 
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Overview Bar with Period Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                  Overview
                </h2>

                <div style={{ display: 'flex', background: '#FFFFFF', padding: '4px', borderRadius: '10px', border: '1px solid #E2E8F0', gap: '4px' }}>
                  {[
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: 'This week' },
                    { id: 'month', label: 'This month' },
                    { id: 'year', label: 'This year' }
                  ].map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setDashboardPeriod(period.id)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: dashboardPeriod === period.id ? '#BE185D' : 'transparent',
                        color: dashboardPeriod === period.id ? '#FFFFFF' : '#475569',
                        fontWeight: '600',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Metric Cards Row (Matching Screenshot) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Orders Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BE185D', marginBottom: '12px' }}>
                    <Package size={20} />
                    <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#64748B' }}>Orders</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                    {dashboardPeriod === 'today' ? orders.length : kpis.totalOrdersCount}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', display: 'block', marginTop: '8px', fontWeight: '600' }}>
                    ↑ +14% vs période précédente
                  </span>
                </div>

                {/* Average Order Value Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BE185D', marginBottom: '12px' }}>
                    <BarChart3 size={20} />
                    <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#64748B' }}>Average Order Value</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                    MAD {kpis.avgOrderValue ? `${kpis.avgOrderValue}.00` : '0.00'}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '8px' }}>
                    Calculé sur l'ensemble des commandes livrées
                  </span>
                </div>

                {/* Visits Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BE185D', marginBottom: '12px' }}>
                    <Eye size={20} />
                    <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#64748B' }}>Visits</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                    {dashboardPeriod === 'today' ? 142 : 1420}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', display: 'block', marginTop: '8px', fontWeight: '600' }}>
                    ↑ Visiteurs actifs via Instagram & Facebook Ads
                  </span>
                </div>
              </div>

              {/* Lower Section: Chart + Top Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Sales & Orders Graph Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9E1B46' }} />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Orders</span>
                      <strong style={{ fontSize: '1.2rem', color: '#0F172A', marginLeft: '6px' }}>{orders.length}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F472B6' }} />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Sales</span>
                      <strong style={{ fontSize: '1.4rem', color: '#0F172A', marginLeft: '6px' }}>MAD {kpis.totalSales}.00</strong>
                    </div>
                  </div>

                  {/* Simulated Visual Chart */}
                  <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingTop: '20px', borderBottom: '1px solid #F1F5F9' }}>
                    {[
                      { label: '08:00', orders: 1, val: 35 },
                      { label: '10:00', orders: 2, val: 65 },
                      { label: '12:00', orders: 4, val: 95 },
                      { label: '14:00', orders: 3, val: 80 },
                      { label: '16:00', orders: 5, val: 120 },
                      { label: '18:00', orders: 6, val: 150 },
                      { label: '20:00', orders: 4, val: 110 },
                      { label: '22:00', orders: 2, val: 50 }
                    ].map((item, i) => (
                      <div key={i} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div 
                          style={{ 
                            width: '100%', 
                            height: `${item.val}px`, 
                            background: i === 5 ? 'linear-gradient(to top, #9E1B46, #F472B6)' : 'rgba(158, 27, 70, 0.15)', 
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.3s'
                          }} 
                          title={`${item.orders} commandes - MAD ${(item.orders * 450)}.00`}
                        />
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>

                {/* Top Products Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                      Top products
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Orders</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {products.slice(0, 5).map((p, idx) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #F1F5F9', flexShrink: 0 }} 
                          />
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1E293B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.name}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: '700' }}>
                              {p.price} DH
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A', flexShrink: 0 }}>
                          {12 - (idx * 2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveNav('products')}
                    style={{ 
                      marginTop: '20px', 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      background: '#F8FAFC', 
                      color: '#1E293B', 
                      fontWeight: '600', 
                      fontSize: '0.82rem',
                      cursor: 'pointer' 
                    }}
                  >
                    Voir tous les produits →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: PRODUCTS MANAGEMENT (User's Core Request!)          */}
          {/* ======================================================== */}
          {activeNav === 'products' && (
            <div>
              {/* Products Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                      Gestion du Catalogue Produits
                    </h1>
                    <span style={{ background: '#EEF2F6', color: '#1E293B', fontSize: '0.82rem', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                      {products.length} articles
                    </span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                    Ajoutez, modifiez vos articles, ajustez les prix et surveillez les stocks en temps réel.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleOpenAddProduct}
                    className="btn-gold"
                    style={{ 
                      padding: '11px 22px', 
                      fontSize: '0.9rem', 
                      borderRadius: '10px', 
                      fontWeight: '700', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)'
                    }}
                  >
                    <Plus size={18} />
                    <span>Ajouter un Produit</span>
                  </button>
                </div>
              </div>

              {/* Quick Stock Summary KPI Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '600' }}>EN STOCK</span>
                    <strong style={{ fontSize: '1.25rem', color: '#0F172A' }}>{productStats.inStock} articles</strong>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '600' }}>STOCK FAIBLE (≤ 3)</span>
                    <strong style={{ fontSize: '1.25rem', color: '#D97706' }}>{productStats.lowStock} article(s)</strong>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '600' }}>RUPTURE DE STOCK</span>
                    <strong style={{ fontSize: '1.25rem', color: '#DC2626' }}>{productStats.outOfStock} article(s)</strong>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F8FAFC', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '600' }}>VALEUR DU STOCK</span>
                    <strong style={{ fontSize: '1.25rem', color: '#0F172A' }}>{productStats.totalInventoryValue.toLocaleString()} DH</strong>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div style={{ background: '#FFFFFF', padding: '18px 24px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                {/* Search Box */}
                <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1, maxWidth: '400px' }}>
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', top: '13px', left: '14px' }} />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher par nom, référence..."
                    style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none' }}
                  />
                  {productSearch && (
                    <button 
                      onClick={() => setProductSearch('')}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Category & Stock Dropdowns */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF', color: '#1E293B', fontWeight: '600', cursor: 'pointer' }}
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="watches">Montres</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="rings">Bagues</option>
                    <option value="sets">Coffrets Cadeaux</option>
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF', color: '#1E293B', fontWeight: '600', cursor: 'pointer' }}
                  >
                    <option value="all">Tous les stocks</option>
                    <option value="in_stock">En Stock (&gt; 3)</option>
                    <option value="low_stock">Stock Faible (1 à 3)</option>
                    <option value="out_of_stock">Rupture de Stock (0)</option>
                  </select>
                </div>
              </div>

              {/* Products Table (SaaS Layout) */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: '700' }}>
                        <th style={{ padding: '16px 20px', width: '380px' }}>Produit</th>
                        <th style={{ padding: '16px 20px' }}>Tarifs (DH)</th>
                        <th style={{ padding: '16px 20px' }}>Stock Disponible</th>
                        <th style={{ padding: '16px 20px' }}>Badge</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                            <Tag size={36} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
                            <p style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 6px 0', color: '#1E293B' }}>
                              Aucun produit ne correspond à votre recherche
                            </p>
                            <span style={{ fontSize: '0.85rem' }}>Essayez d’effacer vos filtres ou d’ajouter un nouveau produit.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => {
                          const discount = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                          const stockCount = p.stock !== undefined ? p.stock : 0;

                          return (
                            <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}>
                              {/* 1. Product Thumbnail & Title */}
                              <td style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                                    />
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                                        {p.id}
                                      </span>
                                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#D97706', textTransform: 'uppercase' }}>
                                        {p.category}
                                      </span>
                                    </div>
                                    <strong style={{ color: '#0F172A', fontSize: '0.92rem', display: 'block', lineHeight: '1.3' }}>
                                      {p.name}
                                    </strong>
                                    {p.nameAr && (
                                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', direction: 'rtl', textAlign: 'left', marginTop: '2px' }}>
                                        {p.nameAr}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 2. Pricing & Discount */}
                              <td style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0F172A' }}>
                                    {p.price} DH
                                  </span>
                                  {p.originalPrice > p.price && (
                                    <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.8rem' }}>
                                      {p.originalPrice} DH
                                    </span>
                                  )}
                                </div>
                                {discount > 0 && (
                                  <span style={{ display: 'inline-block', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', marginTop: '4px' }}>
                                    -{discount}% de réduction
                                  </span>
                                )}
                              </td>

                              {/* 3. Stock Level with Stepper */}
                              <td style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span 
                                    style={{ 
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '4px 10px', 
                                      borderRadius: '999px', 
                                      fontSize: '0.78rem', 
                                      fontWeight: '700',
                                      background: stockCount > 3 ? '#ECFDF5' : (stockCount > 0 ? '#FEF3C7' : '#FEE2E2'),
                                      color: stockCount > 3 ? '#059669' : (stockCount > 0 ? '#D97706' : '#DC2626')
                                    }}
                                  >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                    {stockCount > 3 ? `En stock (${stockCount})` : (stockCount > 0 ? `Faible (${stockCount})` : 'Rupture (0)')}
                                  </span>

                                  {/* Quick Stepper */}
                                  <div style={{ display: 'flex', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
                                    <button 
                                      onClick={() => handleQuickStockChange(p.id, -1)}
                                      style={{ padding: '2px 7px', background: '#F8FAFC', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#475569' }}
                                      title="Diminuer stock (-1)"
                                    >
                                      -
                                    </button>
                                    <button 
                                      onClick={() => handleQuickStockChange(p.id, 1)}
                                      style={{ padding: '2px 7px', background: '#F8FAFC', border: 'none', borderLeft: '1px solid #CBD5E1', cursor: 'pointer', fontSize: '0.8rem', color: '#475569' }}
                                      title="Augmenter stock (+1)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* 4. Marketing Badge */}
                              <td style={{ padding: '16px 20px' }}>
                                {p.badge ? (
                                  <span style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                                    ★ {p.badge}
                                  </span>
                                ) : (
                                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>—</span>
                                )}
                              </td>

                              {/* 5. Actions */}
                              <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    style={{
                                      padding: '7px 12px',
                                      borderRadius: '8px',
                                      background: '#F1F5F9',
                                      border: '1px solid #CBD5E1',
                                      color: '#1E293B',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      cursor: 'pointer'
                                    }}
                                    title="Modifier le produit"
                                  >
                                    <Edit3 size={13} />
                                    <span>Modifier</span>
                                  </button>

                                  <button
                                    onClick={() => navigateTo('product', p.id)}
                                    style={{
                                      padding: '7px 10px',
                                      borderRadius: '8px',
                                      background: '#FFFFFF',
                                      border: '1px solid #CBD5E1',
                                      color: '#475569',
                                      fontSize: '0.8rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      cursor: 'pointer'
                                    }}
                                    title="Voir sur la boutique"
                                  >
                                    <Eye size={13} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      const url = `${window.location.origin}/#/produit/${p.slug || p.id}`;
                                      if (navigator.clipboard) {
                                        navigator.clipboard.writeText(url);
                                        addToast(`Lien copié : ${url}`);
                                      }
                                    }}
                                    style={{
                                      padding: '7px 10px',
                                      borderRadius: '8px',
                                      background: '#FFFFFF',
                                      border: '1px solid #CBD5E1',
                                      color: '#475569',
                                      fontSize: '0.8rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      cursor: 'pointer'
                                    }}
                                    title="Copier l'URL directe de ce produit"
                                  >
                                    <ExternalLink size={13} />
                                  </button>

                                  <button
                                    onClick={() => handleDuplicateProduct(p)}
                                    style={{
                                      padding: '7px 10px',
                                      borderRadius: '8px',
                                      background: '#FFFFFF',
                                      border: '1px solid #CBD5E1',
                                      color: '#475569',
                                      fontSize: '0.8rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      cursor: 'pointer'
                                    }}
                                    title="Dupliquer ce produit"
                                  >
                                    <Copy size={13} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProduct(p)}
                                    style={{
                                      padding: '7px 10px',
                                      borderRadius: '8px',
                                      background: '#FEF2F2',
                                      border: '1px solid #FCA5A5',
                                      color: '#DC2626',
                                      fontSize: '0.8rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      cursor: 'pointer'
                                    }}
                                    title="Supprimer ce produit"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: ORDERS MANAGEMENT                                  */}
          {/* ======================================================== */}
          {activeNav === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Gestion des Commandes Espèces (COD)
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                    Suivez, confirmez par WhatsApp et expédiez vos commandes Amana & Cathedis.
                  </p>
                </div>
              </div>

              {/* Order Status Tabs & Search */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ position: 'relative', minWidth: '280px' }}>
                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Rechercher par N°, nom, ville..."
                      style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: orderStatusFilter === st.id ? '#1E293B' : '#F1F5F9',
                          color: orderStatusFilter === st.id ? '#FFFFFF' : '#475569',
                          border: 'none',
                          cursor: 'pointer'
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
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '14px 20px' }}>Commande</th>
                        <th style={{ padding: '14px 20px' }}>Client & Contact</th>
                        <th style={{ padding: '14px 20px' }}>Ville & Adresse</th>
                        <th style={{ padding: '14px 20px' }}>Articles & Montant</th>
                        <th style={{ padding: '14px 20px' }}>Statut Expédition</th>
                        <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                            Aucune commande trouvée.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '16px 20px' }}>
                              <strong style={{ color: '#0F172A', display: 'block' }}>{ord.id}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                {new Date(ord.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <strong style={{ color: '#0F172A', display: 'block' }}>{ord.customer.fullName}</strong>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <span style={{ color: '#D97706', fontWeight: '700' }}>{ord.customer.phone}</span>
                                <button
                                  onClick={() => handleSendWhatsAppConfirmation(ord)}
                                  style={{ background: '#25D366', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  title="Envoyer confirmation WhatsApp"
                                >
                                  <Phone size={10} />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ fontWeight: '600', color: '#0F172A', display: 'block' }}>📍 {ord.customer.city}</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ord.customer.address}
                              </span>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{ord.total} DH</strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{ord.items.length} article(s) • Espèces COD</span>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '700',
                                  background: ord.status === 'delivered' ? '#ECFDF5' : (ord.status === 'shipped' ? '#EFF6FF' : (ord.status === 'confirmed' ? '#FEF3C7' : '#FAF8F5')),
                                  color: ord.status === 'delivered' ? '#059669' : (ord.status === 'shipped' ? '#1D4ED8' : (ord.status === 'confirmed' ? '#D97706' : '#475569')),
                                  border: '1px solid #CBD5E1',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="pending_confirmation">À Confirmer</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="processing">En Préparation</option>
                                <option value="shipped">Expédiée</option>
                                <option value="out_for_delivery">En Cours de Livraison</option>
                                <option value="delivered">Livrée & Encaissée</option>
                                <option value="cancelled">Annulée</option>
                              </select>
                            </td>

                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                              <button
                                onClick={() => setPrintableSlipOrder(ord)}
                                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1E293B', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title="Imprimer bordereau de livraison"
                              >
                                <Printer size={13} />
                                <span>Bordereau</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: COUPONS & DISCOUNTS                                */}
          {/* ======================================================== */}
          {activeNav === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Codes Promotionnels & Offres
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                    Créez des remises spéciales pour booster vos conversions lors de vos campagnes publicitaires.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {coupons.map((c) => (
                  <div key={c.code} style={{ background: '#FFFFFF', border: '2px dashed #CBD5E1', borderRadius: '14px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0F172A', letterSpacing: '0.05em' }}>{c.code}</span>
                      <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>Actif</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#475569', margin: '6px 0' }}>
                      {c.type === 'percentage' ? `-${c.value}% de réduction immédiate` : 'Livraison gratuite partout au Maroc'}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Utilisé {c.uses} fois par les clients</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: CUSTOMERS                                          */}
          {/* ======================================================== */}
          {activeNav === 'customers' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Base Clients TWISHIYAT
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                  Consultez la liste de vos acheteurs, leur historique d'achat et contactez-les directement.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '14px 20px' }}>Client</th>
                      <th style={{ padding: '14px 20px' }}>Téléphone</th>
                      <th style={{ padding: '14px 20px' }}>Ville</th>
                      <th style={{ padding: '14px 20px' }}>Commandes</th>
                      <th style={{ padding: '14px 20px' }}>Total Dépensé</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersList.map((cust, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: '#0F172A' }}>{cust.fullName}</strong>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#D97706', fontWeight: '700' }}>
                          {cust.phone}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>
                          📍 {cust.city}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
                            {cust.ordersCount} commande(s)
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: '#0F172A' }}>
                          {cust.totalSpent} DH
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => window.open(`https://wa.me/212${cust.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Salam ${cust.fullName} ! Merci pour votre confiance envers TWISHIYAT.`)}`, '_blank')}
                            style={{ background: '#25D366', color: '#FFFFFF', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
                          >
                            <Phone size={12} />
                            <span>Contacter WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: INSIGHTS & ANALYTICS                               */}
          {/* ======================================================== */}
          {activeNav === 'insights' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Statistiques & Performances E-Commerce
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                  Indicateurs clés du marché marocain (confirmation COD, panier moyen, livraisons).
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Chiffre d'Affaires Brut</span>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>
                    {kpis.totalSales.toLocaleString()} DH
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Taux Confirmation COD</span>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginTop: '6px' }}>
                    {kpis.codConfirmationRate}%
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Colis Livrés & Encaissés</span>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0284C7', marginTop: '6px' }}>
                    {kpis.deliveredCount} colis
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: REVIEWS MODERATION                                 */}
          {/* ======================================================== */}
          {activeNav === 'reviews' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Avis Clients Vérifiés ({reviews.length})
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                  Ces avis s'affichent publiquement sur vos fiches produits pour rassurer vos visiteurs.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{r.customerName} (📍 {r.city})</strong>
                        <span style={{ color: '#F59E0B', fontSize: '0.82rem' }}>★ {r.rating}/5</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '2px 0 6px 0' }}>"{r.comment}"</p>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{r.date}</span>
                    </div>
                    <span style={{ background: '#ECFDF5', color: '#065F46', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                      Approuvé & Publié
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: UP SELLS & OFFERS                                   */}
          {/* ======================================================== */}
          {activeNav === 'upsells' && (
            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <TrendingUp size={24} color="#BE185D" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Stratégie Up Sells & Packs Cadeaux</h2>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Les offres de vente croisée permettent d'augmenter le panier moyen de <strong>+35%</strong>.
                Sur TWISHIYAT, proposez automatiquement le <em>Coffret Montre + Bracelet assorti</em> lors du passage en caisse.
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: INVOICES                                           */}
          {/* ======================================================== */}
          {activeNav === 'invoices' && (
            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Receipt size={24} color="#0284C7" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Factures & Bordereaux d'Expédition</h2>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Tous vos bordereaux d'expédition avec mention de paiement à la livraison (COD) sont générés automatiquement depuis l'onglet <strong>Orders</strong>.
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: SUPPORT & APPS & AFFILIATE                         */}
          {/* ======================================================== */}
          {['apps', 'affiliate', 'support'].includes(activeNav) && (
            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Headphones size={36} color="#D97706" style={{ margin: '0 auto 12px auto' }} />
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 8px 0', textTransform: 'capitalize' }}>{activeNav} TWISHIYAT</h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto' }}>
                Ce module est configuré et synchronisé avec votre boutique en ligne.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL: AJOUTER / MODIFIER UN PRODUIT (Rock-Solid!)    */}
      {/* ======================================================== */}
      {productModalOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            zIndex: 999 
          }}
          onClick={() => setProductModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '820px', 
              width: '100%', 
              maxHeight: '92vh', 
              background: '#FFFFFF', 
              borderRadius: '20px', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden' 
            }}
          >
            {/* Modal Header */}
            <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--gold-500)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--gold-400)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    {isEditingMode ? `Modifier : ${productFormData.name || 'Produit'}` : 'Ajouter un Nouveau Produit'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                  Espace Pro TWISHIYAT — Catalogue et gestion des stocks
                </p>
              </div>
              <button 
                onClick={() => setProductModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0 20px', overflowX: 'auto' }}>
              {[
                { id: 'general', label: '1. Détails & Tarifs', icon: Tag },
                { id: 'media', label: '2. Photos & Médias', icon: ImageIcon },
                { id: 'specs', label: '3. Fiche Horlogère & Matière', icon: ShieldCheck },
                { id: 'descriptions', label: '4. Textes & Version Arabe', icon: FileText }
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
                      color: isActive ? '#0F172A' : '#64748B',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <IconComp size={16} color={isActive ? 'var(--gold-600)' : '#94A3B8'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px 28px', flexGrow: 1, overflowY: 'auto' }}>

                {/* TAB 1: GENERAL & PRICING */}
                {modalTab === 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                        Nom du produit (Français) *
                      </label>
                      <input
                        type="text"
                        required
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        placeholder="ex: Montre Royale Chronographe Saphir Dorée"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                          Catégorie
                        </label>
                        <select
                          value={productFormData.category}
                          onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="watches">Montres</option>
                          <option value="bracelets">Bracelets & Joncs</option>
                          <option value="rings">Bagues & Chevalières</option>
                          <option value="sets">Coffrets Cadeaux</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                          Public Cible / Genre
                        </label>
                        <select
                          value={productFormData.gender}
                          onChange={(e) => setProductFormData({ ...productFormData, gender: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="men">Homme</option>
                          <option value="women">Femme</option>
                          <option value="unisex">Unisexe / Mixte</option>
                        </select>
                      </div>
                    </div>

                    {/* Pricing Box */}
                    <div style={{ background: '#FAF8F5', border: '1px solid #EFEAE2', padding: '18px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-800)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '14px' }}>
                        Tarifs & Disponibilité (Dirhams Marocains)
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Prix de Vente Réel (DH) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={productFormData.price}
                            onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 'bold', fontSize: '1rem', color: 'var(--gold-900)', background: '#FFFFFF' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Prix d'Origine Barré (DH)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={productFormData.originalPrice}
                            onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                            placeholder="ex: 599"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', background: '#FFFFFF' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Quantité en Stock Disponible
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={productFormData.stock}
                            onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', background: '#FFFFFF' }}
                          />
                        </div>
                      </div>

                      {Number(productFormData.originalPrice) > Number(productFormData.price) && (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#059669', fontWeight: '700' }}>
                          <Percent size={15} />
                          <span>
                            Réduction affichée sur la boutique : -{Math.round(((Number(productFormData.originalPrice) - Number(productFormData.price)) / Number(productFormData.originalPrice)) * 100)}% d'économie !
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badge & Sizing */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                          Badge Promotionnel
                        </label>
                        <select
                          value={productFormData.badge}
                          onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#FFFFFF' }}
                        >
                          <option value="">Aucun badge</option>
                          <option value="Best-Seller">⭐ Best-Seller</option>
                          <option value="Nouveauté">✨ Nouveauté</option>
                          <option value="Édition Limitée">👑 Édition Limitée</option>
                          <option value="Vente Flash">🔥 Vente Flash</option>
                          <option value="Coup de Cœur">❤️ Coup de Cœur</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                          Ajustement & Taille
                        </label>
                        <input
                          type="text"
                          value={productFormData.sizeGuide}
                          onChange={(e) => setProductFormData({ ...productFormData, sizeGuide: e.target.value })}
                          placeholder="ex: Taille Unique Ajustable (Outil offert)"
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHOTOS & MEDIA */}
                {modalTab === 'media' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                        Image Principale du Produit
                      </label>

                      {/* Source Selection Buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                        <button
                          type="button"
                          onClick={() => setImageSourceMode('presets')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: imageSourceMode === 'presets' ? '1px solid var(--gold-600)' : '1px solid #CBD5E1',
                            background: imageSourceMode === 'presets' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'presets' ? 'var(--gold-800)' : '#475569',
                            fontWeight: '700',
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
                          onClick={() => setImageSourceMode('upload')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: imageSourceMode === 'upload' ? '1px solid var(--gold-600)' : '1px solid #CBD5E1',
                            background: imageSourceMode === 'upload' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'upload' ? 'var(--gold-800)' : '#475569',
                            fontWeight: '700',
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
                          onClick={() => setImageSourceMode('url')}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: imageSourceMode === 'url' ? '1px solid var(--gold-600)' : '1px solid #CBD5E1',
                            background: imageSourceMode === 'url' ? 'rgba(212, 175, 55, 0.12)' : '#FFFFFF',
                            color: imageSourceMode === 'url' ? 'var(--gold-800)' : '#475569',
                            fontWeight: '700',
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

                      {/* Mode: Presets */}
                      {imageSourceMode === 'presets' && (
                        <div style={{ marginBottom: '14px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                            Cliquez sur une photo pour l’assigner en 1 clic :
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: '10px' }}>
                            {IMAGE_PRESETS.map((preset) => {
                              const isSelected = productFormData.image === preset.image;
                              return (
                                <div
                                  key={preset.id}
                                  onClick={() => setProductFormData({ ...productFormData, image: preset.image })}
                                  style={{
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    border: isSelected ? '3px solid var(--gold-500)' : '1px solid #E2E8F0',
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

                      {/* Mode: Upload */}
                      {imageSourceMode === 'upload' && (
                        <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#F8FAFC', marginBottom: '14px' }}>
                          <Upload size={32} color="var(--gold-500)" style={{ margin: '0 auto 8px auto' }} />
                          <p style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                            Prendre une photo ou sélectionner depuis vos fichiers
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '12px' }}>
                            JPG, PNG, WEBP max 5 Mo
                          </span>
                          <label className="btn-dark" style={{ padding: '8px 18px', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>Parcourir mon appareil</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                      )}

                      {/* Mode: URL */}
                      {imageSourceMode === 'url' && (
                        <div style={{ marginBottom: '14px' }}>
                          <input
                            type="url"
                            value={productFormData.image}
                            onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                            placeholder="https://exemple.com/photos/montre.jpg"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                          />
                        </div>
                      )}

                      {/* Preview Thumbnail */}
                      {productFormData.image && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                          <img src={productFormData.image} alt="Aperçu" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', display: 'block' }}>
                              Aperçu photo produit
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
                              ✓ Prête pour la boutique
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Gallery */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B' }}>
                            Galerie Photos Additionnelles (Angles différents)
                          </label>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                            Permet aux clients de voir plusieurs angles au poignet ou dans l'écrin
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
                            <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
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
                          Aucune photo additionnelle.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: SPECS & HORLOGERIE */}
                {modalTab === 'specs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                      Caractéristiques techniques affichées sur la fiche produit pour rassurer les clients :
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Matériau & Finition
                        </label>
                        <input
                          type="text"
                          value={productFormData.material}
                          onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                          placeholder="Alliage Haute Résistance & Finition Dorée Haute Précision"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Étanchéité (Water Resistance)
                        </label>
                        <input
                          type="text"
                          value={productFormData.waterResistance}
                          onChange={(e) => setProductFormData({ ...productFormData, waterResistance: e.target.value })}
                          placeholder="5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Type de Verre
                        </label>
                        <input
                          type="text"
                          value={productFormData.glass}
                          onChange={(e) => setProductFormData({ ...productFormData, glass: e.target.value })}
                          placeholder="Saphir Inrayable traité antireflet"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Mouvement / Mécanisme
                        </label>
                        <input
                          type="text"
                          value={productFormData.movement}
                          onChange={(e) => setProductFormData({ ...productFormData, movement: e.target.value })}
                          placeholder="Quartz Haute Précision Chronographe"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Diamètre & Dimensions
                        </label>
                        <input
                          type="text"
                          value={productFormData.dimensions}
                          onChange={(e) => setProductFormData({ ...productFormData, dimensions: e.target.value })}
                          placeholder="41 mm (Épaisseur 11 mm)"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                          Garantie Incluse
                        </label>
                        <input
                          type="text"
                          value={productFormData.warranty}
                          onChange={(e) => setProductFormData({ ...productFormData, warranty: e.target.value })}
                          placeholder="Garantie Prestige 1 An incluse avec carte TWISHIYAT"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: DESCRIPTIONS & ARABIC */}
                {modalTab === 'descriptions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                        Accroche Courte (affichée sous le titre)
                      </label>
                      <input
                        type="text"
                        value={productFormData.shortDescription}
                        onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                        placeholder="ex: Chronographe d’exception avec cadran vert soleillé et finitions dorées prestige."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                        Description Complète du Produit
                      </label>
                      <textarea
                        rows={3}
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                        placeholder="Détaillez les inspirations, le confort au poignet, les finitions et le contenu du coffret cadeau..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>

                    {/* Arabic Fields */}
                    <div style={{ background: '#FAF8F5', border: '1px solid #EFEAE2', padding: '16px', borderRadius: '12px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-800)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                        🇲🇦 Version en Langue Arabe (Optionnel)
                      </span>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Nom du produit en Arabe (اسم المنتج)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={productFormData.nameAr}
                            onChange={(e) => setProductFormData({ ...productFormData, nameAr: e.target.value })}
                            placeholder="ساعة ملكية فاخرة بلمسات ذهبية متألقة"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', textAlign: 'right' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Description en Arabe (وصف المنتج)
                          </label>
                          <textarea
                            rows={2}
                            dir="rtl"
                            value={productFormData.descriptionAr}
                            onChange={(e) => setProductFormData({ ...productFormData, descriptionAr: e.target.value })}
                            placeholder="تحفة استثنائية مستوحاة من الأناقة المغربية العصرية..."
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', textAlign: 'right', fontFamily: 'inherit', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Sticky Footer */}
              <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 28px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Enregistrement immédiat dans le catalogue
                </span>

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

      {/* ======================================================== */}
      {/* 5. PRINTABLE SHIPPING SLIP MODAL                         */}
      {/* ======================================================== */}
      {printableSlipOrder && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 999 }}
          onClick={() => setPrintableSlipOrder(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '600px', width: '100%', background: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={brandLogo}
                  alt="TWISHIYAT"
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37', background: '#F7F3EC' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800' }}>TWISHIYAT</h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Bordereau d'Expédition & Encaissement COD</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0F172A' }}>{printableSlipOrder.id}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>Colis Express Maroc</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#64748B' }}>EXPÉDITEUR :</strong>
                TWISHIYAT - Expéditions Maroc<br />
                Bd Al Massira, Maarif, Casablanca<br />
                Tél : 07 08 75 95 10
              </div>
              <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#64748B' }}>DESTINATAIRE :</strong>
                <strong>{printableSlipOrder.customer.fullName}</strong><br />
                {printableSlipOrder.customer.address}<br />
                <strong>{printableSlipOrder.customer.city}</strong><br />
                Tél : <strong>{printableSlipOrder.customer.phone}</strong>
              </div>
            </div>

            <div style={{ border: '2px dashed var(--gold-600)', background: 'var(--gold-50)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>MONTANT TOTAL À ENCAISSER EN ESPÈCES :</span>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', marginTop: '4px' }}>
                {printableSlipOrder.total} DH
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', display: 'block', marginTop: '4px' }}>
                ✓ Le client a le droit d'ouvrir et de vérifier le colis avant paiement.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-dark" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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

    </div>
  );
}
