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
      const saved = localStorage.getItem('twasha_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: PRODUCTS[0],
          variant: PRODUCTS[0].variants[0],
          size: PRODUCTS[0].sizes[0],
          quantity: 1
        }
      ];
    } catch (e) {
      return [
        {
          product: PRODUCTS[0],
          variant: PRODUCTS[0].variants[0],
          size: PRODUCTS[0].sizes[0],
          quantity: 1
        }
      ];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('twasha_wishlist');
      return saved ? JSON.parse(saved) : ['TD-B01', 'TD-R01'];
    } catch (e) {
      return ['TD-B01', 'TD-R01'];
    }
  });

  // Persist cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem('twasha_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('twasha_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);
  const [currentView, setCurrentView] = useState('home'); // home, catalog, product, cart, checkout, confirmation, tracking, account, admin
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [selectedOrderId, setSelectedOrderId] = useState('TD-8492');
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

  // Sync RTL and language on html tag
  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['admin', 'catalog', 'tracking', 'account', 'checkout'].includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
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
      const prod = PRODUCTS.find(p => p.id === payload);
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
    if (clean === 'TWASHA10') {
      setAppliedCoupon({ code: 'TWASHA10', discountPercent: 10, label: '10% de réduction immédiate' });
      addToast(language === 'ar' ? 'تم تفعيل كود الخصم 10% بنجاح!' : 'Code promo TWASHA10 appliqué : -10% !');
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
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping;
  const discountAmount = appliedCoupon?.discountPercent
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  return (
    <StoreContext.Provider
      value={{
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
        setLastPlacedOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
