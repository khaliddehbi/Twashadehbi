import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS } from '../data/products';
import { FREE_SHIPPING_THRESHOLD } from '../data/moroccanCities';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [language, setLanguage] = useState('fr'); // 'fr', 'ar', 'en'
  const [currency] = useState('MAD');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_cart') || localStorage.getItem('twasha_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_wishlist') || localStorage.getItem('twasha_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem('twishiyat_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('twishiyat_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_products') || localStorage.getItem('twasha_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch (e) {
      return PRODUCTS;
    }
  });

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twishiyat_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  const addNewProduct = (productData) => {
    const idPrefix = productData.category === 'watches' ? 'TW-W' : (productData.category === 'bracelets' ? 'TW-B' : (productData.category === 'rings' ? 'TW-R' : 'TW-S'));
    const newId = `${idPrefix}${Date.now().toString().slice(-4)}`;
    const price = Number(productData.price) || 0;
    const originalPrice = productData.originalPrice ? Number(productData.originalPrice) : Math.round(price * 1.35);
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    
    const newProd = {
      id: newId,
      slug: (productData.name || 'produit').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: productData.name,
      nameAr: productData.nameAr || productData.name,
      nameEn: productData.nameEn || productData.name,
      category: productData.category || 'watches',
      gender: productData.gender || 'men',
      price: price,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      stock: Number(productData.stock) || 10,
      badge: productData.badge || '',
      isBestSeller: productData.badge === 'Best-Seller',
      isNewArrival: productData.badge === 'Nouveauté',
      isFlashSale: productData.badge === 'Vente Flash',
      image: productData.image || (products[0] ? products[0].image : PRODUCTS[0].image),
      gallery: (productData.gallery && productData.gallery.length > 0) ? productData.gallery : [productData.image || (products[0] ? products[0].image : PRODUCTS[0].image)],
      videoUrl: productData.videoUrl || '',
      shortDescription: productData.shortDescription || 'Élégance et raffinement signés TWISHIYAT.',
      shortDescriptionAr: productData.shortDescriptionAr || '',
      description: productData.description || 'Accessoire d’exception issu de la collection TWISHIYAT. Conçu avec des matériaux nobles sélectionnés pour une durabilité maximale au quotidien. Livré dans son écrin de protection.',
      descriptionAr: productData.descriptionAr || '',
      specs: productData.specs || {
        'Matériau': 'Alliage Haute Résistance & Finition Dorée Haute Précision',
        'Étanchéité': 'Water Resistant (Résiste à l’eau)',
        'Garantie': 'Garantie 1 An incluse'
      },
      variants: (productData.variants && productData.variants.length > 0) ? productData.variants : [
        { id: 'v1', name: 'Doré Brillant', colorHex: '#D4AF37' }
      ],
      sizes: (productData.sizes && productData.sizes.length > 0) ? productData.sizes : ['Taille Unique Ajustable'],
      rating: 5.0,
      reviewsCount: 1
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (productId, fields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, ...fields };
          const pr = Number(updated.price);
          const orig = Number(updated.originalPrice);
          if (orig > pr) {
            updated.discountPercent = Math.round(((orig - pr) / orig) * 100);
          } else {
            updated.discountPercent = 0;
          }
          if (fields.badge !== undefined) {
            updated.isBestSeller = fields.badge === 'Best-Seller';
            updated.isNewArrival = fields.badge === 'Nouveauté';
            updated.isFlashSale = fields.badge === 'Vente Flash';
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const [currentView, setCurrentView] = useState('home'); // home, catalog, product, cart, checkout, confirmation, tracking, account, admin
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [selectedOrderId, setSelectedOrderId] = useState('TW-8492');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([100, 1200]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [pixelsLog, setPixelsLog] = useState([
    { id: 1, type: 'PageView', name: 'Meta Pixel / TikTok', data: { page: 'Homepage' }, time: new Date().toLocaleTimeString() }
  ]);
  const [showPixelHUD, setShowPixelHUD] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Real Customer Profile (Local to this specific visitor's browser)
  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_customer_profile');
      return saved ? JSON.parse(saved) : { fullName: '', phone: '', email: '', city: 'Casablanca', address: '' };
    } catch (e) {
      return { fullName: '', phone: '', email: '', city: 'Casablanca', address: '' };
    }
  });

  const updateCustomerProfile = (updates) => {
    setCustomerProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('twishiyat_customer_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Real Customer Orders (Only orders placed by this specific client)
  const [customerOrders, setCustomerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_my_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const recordCustomerOrder = (newOrder) => {
    setCustomerOrders((prev) => {
      const updated = [newOrder, ...prev.filter(o => o.id !== newOrder.id)];
      try {
        localStorage.setItem('twishiyat_my_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (newOrder.customer) {
      updateCustomerProfile({
        fullName: newOrder.customer.fullName || '',
        phone: newOrder.customer.phone || '',
        city: newOrder.customer.city || '',
        address: newOrder.customer.address || ''
      });
    }
  };

  // Sync RTL and language on html tag
  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      const [route, queryString] = rawHash.split('?');
      const params = new URLSearchParams(queryString || window.location.search);

      // Deep Linking for Products (Ads from Instagram/Facebook)
      const productId = params.get('product') || params.get('id');
      if (productId) {
        const found = products.find(p => p.id === productId || p.slug === productId);
        if (found) {
          setSelectedProductId(found.id);
          setCurrentView('product');
          return;
        }
      }

      if (['espace-pro', 'admin'].includes(route)) {
        setCurrentView('admin');
      } else if (['catalog', 'tracking', 'account', 'checkout', 'product'].includes(route)) {
        setCurrentView(route);
      } else if (!rawHash) {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const trackPixel = (type, data = {}) => {
    const newEntry = {
      id: Date.now(),
      type,
      name: 'Meta Pixel / TikTok / GA4',
      data,
      time: new Date().toLocaleTimeString()
    };
    setPixelsLog((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  const navigateTo = (view, payload = null) => {
    if (view === 'product' && payload) {
      setSelectedProductId(payload);
      const prod = products.find(p => p.id === payload);
      trackPixel('ViewContent', { id: payload, name: prod?.name, price: prod?.price });
    } else if (view === 'tracking' && payload) {
      setSelectedOrderId(payload);
    } else if (view === 'catalog') {
      if (payload) setCategoryFilter(payload);
      trackPixel('ViewCategory', { category: payload || 'all' });
    }
    setCurrentView(view);
    if (view === 'home') {
      history.pushState(null, '', window.location.pathname);
    } else if (view === 'admin') {
      window.location.hash = '#/espace-pro';
    } else {
      window.location.hash = `#${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, quantity = 1, variant = null, size = null) => {
    const selectedVariant = variant || product.variants?.[0] || null;
    const selectedSize = size || product.sizes?.[0] || 'Standard';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant?.id === selectedVariant?.id &&
          item.size === selectedSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity, variant: selectedVariant, size: selectedSize }];
      }
    });

    trackPixel('AddToCart', { id: product.id, name: product.name, price: product.price, quantity });
    addToast(
      language === 'ar'
        ? `تمت إضافة "${product.nameAr}" إلى السلة`
        : `"${product.name}" a été ajouté à votre panier !`
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      const newQty = newCart[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      newCart[index].quantity = newQty;
      return newCart;
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const newWish = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      addToast(
        exists
          ? (language === 'ar' ? 'تمت الإزالة من قائمة الرغبات' : 'Retiré de vos favoris')
          : (language === 'ar' ? 'تمت الإضافة إلى قائمة الرغبات' : 'Ajouté à vos favoris ❤️')
      );
      return newWish;
    });
  };

  const applyCouponCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TWISHIYAT10' || clean === 'TWASHA10' || clean === 'TW10') {
      setAppliedCoupon({ code: 'TWISHIYAT10', discountPercent: 10, label: '10% de réduction immédiate' });
      addToast(language === 'ar' ? 'تم تفعيل كود الخصم 10% بنجاح!' : 'Code promo TWISHIYAT10 appliqué : -10% !');
      return true;
    } else if (clean === 'MAROC' || clean === 'CASA') {
      setAppliedCoupon({ code: clean, freeShipping: true, label: 'Livraison Gratuite offerte' });
      addToast(language === 'ar' ? 'تم تفعيل التوصيل المجاني!' : 'Code MAROC appliqué : Livraison gratuite offerte !');
      return true;
    } else if (clean === 'VIP20') {
      setAppliedCoupon({ code: 'VIP20', discountPercent: 20, label: 'Offre VIP 20%' });
      addToast(language === 'ar' ? 'تم تفعيل كود VIP 20%!' : 'Code VIP20 appliqué : -20% de réduction !');
      return true;
    } else {
      addToast(language === 'ar' ? 'رمز الكوبون غير صالح' : 'Code promo non valide ou expiré.', 'error');
      return false;
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeShipping = true; // 100% Free Shipping site-wide across Morocco
  const discountAmount = appliedCoupon?.discountPercent
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        addNewProduct,
        updateProduct,
        deleteProduct,
        language,
        setLanguage,
        currency,
        t,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        currentView,
        navigateTo,
        selectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        genderFilter,
        setGenderFilter,
        priceRange,
        setPriceRange,
        appliedCoupon,
        applyCouponCode,
        cartSubtotal,
        cartItemCount,
        isFreeShipping,
        discountAmount,
        toasts,
        addToast,
        pixelsLog,
        trackPixel,
        showPixelHUD,
        setShowPixelHUD,
        lastPlacedOrder,
        setLastPlacedOrder,
        customerProfile,
        updateCustomerProfile,
        customerOrders,
        recordCustomerOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
