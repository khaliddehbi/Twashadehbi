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
  const saveProductsSafely = (list) => {
    try {
      localStorage.setItem('twishiyat_products', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save error, attempting cleanup:', e);
      try {
        localStorage.removeItem('twasha_products');
        localStorage.setItem('twishiyat_products', JSON.stringify(list));
      } catch (err) {
        console.error('Critical localStorage quota exceeded:', err);
      }
    }
  };

  const [products, setProducts] = useState(() => {
    try {
      const deletedIds = new Set(JSON.parse(localStorage.getItem('twishiyat_deleted_products') || '[]'));
      const saved = localStorage.getItem('twishiyat_products') || localStorage.getItem('twasha_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedMap = new Map();
          // 1. Add all base PRODUCTS (excluding deleted ones)
          PRODUCTS.forEach((p) => {
            if (!deletedIds.has(p.id)) {
              mergedMap.set(p.id, p);
            }
          });
          // 2. Merge user-saved or edited products
          parsed.forEach((p) => {
            if (!deletedIds.has(p.id)) {
              mergedMap.set(p.id, p);
            }
          });
          return Array.from(mergedMap.values());
        }
      }
      return PRODUCTS.filter((p) => !deletedIds.has(p.id));
    } catch (e) {
      return PRODUCTS;
    }
  });

  // Persist products to localStorage whenever products changes
  useEffect(() => {
    saveProductsSafely(products);
  }, [products]);

  const [totalVisitors, setTotalVisitors] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_site_visits');
      return saved ? Number(saved) : 1420;
    } catch {
      return 1420;
    }
  });

  const [productViews, setProductViews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('twishiyat_product_views') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const hasVisitedThisSession = sessionStorage.getItem('twishiyat_session_visited');
    if (!hasVisitedThisSession) {
      sessionStorage.setItem('twishiyat_session_visited', 'true');
      setTotalVisitors((prev) => {
        const next = (prev || 1420) + 1;
        try {
          localStorage.setItem('twishiyat_site_visits', next.toString());
        } catch (e) {}
        return next;
      });
    }
  }, []);

  const updateTotalVisitors = (newCount) => {
    const parsed = Math.max(0, Number(newCount) || 0);
    setTotalVisitors(parsed);
    try {
      localStorage.setItem('twishiyat_site_visits', parsed.toString());
    } catch (e) {}
  };

  const recordProductView = (productId) => {
    if (!productId) return;
    setProductViews((prev) => {
      const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      try {
        localStorage.setItem('twishiyat_product_views', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

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
      stock: Number(productData.stock) >= 0 ? Number(productData.stock) : 10,
      badge: productData.badge || '',
      isBestSeller: productData.badge === 'Best-Seller',
      isNewArrival: productData.badge === 'Nouveauté',
      isFlashSale: productData.badge === 'Vente Flash',
      image: productData.image || (products[0] ? products[0].image : PRODUCTS[0].image),
      gallery: (productData.gallery && productData.gallery.length > 0) ? productData.gallery : [productData.image || (products[0] ? products[0].image : PRODUCTS[0].image)],
      descriptionImages: (productData.descriptionImages && productData.descriptionImages.length > 0) ? productData.descriptionImages : [],
      videoUrl: productData.videoUrl || '',
      shortDescription: productData.shortDescription || `${productData.name} - Sélection prestige TWISHIYAT.`,
      shortDescriptionAr: productData.shortDescriptionAr || '',
      description: productData.description || 'Accessoire d’exception issu de la collection TWISHIYAT. Conçu avec des matériaux nobles sélectionnés pour une durabilité maximale au quotidien. Livré dans son écrin de protection.',
      descriptionAr: productData.descriptionAr || '',
      colorHex: productData.colorHex || productData.variants?.[0]?.colorHex || '#D4AF37',
      specs: productData.specs || {
        'Couleur': productData.color || 'Doré Prestige',
        'Matériau': 'Alliage Haute Résistance & Finition Dorée Haute Précision',
        'Étanchéité': '5 ATM / 50 Mètres (Résiste aux ablutions et éclaboussures)'
      },
      variants: (productData.variants && productData.variants.length > 0) ? productData.variants : [
        { id: 'v1', name: 'Finition Prestige', colorHex: '#D4AF37', stock: Number(productData.stock) || 10 }
      ],
      sizes: (productData.sizes && productData.sizes.length > 0) ? productData.sizes : ['Taille Unique Ajustable'],
      visitorsCount: Number(productData.visitorsCount) >= 0 ? Number(productData.visitorsCount) : 142,
      rating: 5.0,
      reviewsCount: 1
    };

    setProducts((prev) => {
      const next = [newProd, ...prev.filter(p => p.id !== newId)];
      saveProductsSafely(next);
      return next;
    });
    return newProd;
  };

  const updateProduct = (productId, fields) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
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
      });
      saveProductsSafely(next);
      return next;
    });
  };

  const deleteProduct = (productId) => {
    try {
      const deleted = JSON.parse(localStorage.getItem('twishiyat_deleted_products') || '[]');
      if (!deleted.includes(productId)) {
        deleted.push(productId);
        localStorage.setItem('twishiyat_deleted_products', JSON.stringify(deleted));
      }
    } catch (e) {}

    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveProductsSafely(next);
      return next;
    });
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
  const [lastPlacedOrder, setLastPlacedOrderState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('twishiyat_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setLastPlacedOrder = (order) => {
    setLastPlacedOrderState(order);
    try {
      if (order) {
        sessionStorage.setItem('twishiyat_last_order', JSON.stringify(order));
      }
    } catch {}
  };

  // UTM Parameters Capture (Meta Ads, Instagram, Google Ads)
  const [utmParams] = useState(() => {
    try {
      const saved = sessionStorage.getItem('twishiyat_utm_params');
      if (saved) return JSON.parse(saved);
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''));
        const captured = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].forEach((key) => {
          const val = urlParams.get(key);
          if (val) captured[key] = val;
        });
        if (Object.keys(captured).length > 0) {
          sessionStorage.setItem('twishiyat_utm_params', JSON.stringify(captured));
          return captured;
        }
      }
      return {};
    } catch {
      return {};
    }
  });

  // Real Customer Profile (Local to this specific visitor's browser)
  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('twishiyat_customer_profile');
      return saved ? JSON.parse(saved) : { fullName: '', phone: '', email: '', city: '', address: '' };
    } catch (e) {
      return { fullName: '', phone: '', email: '', city: '', address: '' };
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

  // Real Customer Orders (Merged with live status from admin storage)
  const [customerOrders, setCustomerOrders] = useState(() => {
    try {
      const savedMy = localStorage.getItem('twishiyat_my_orders');
      const myOrders = savedMy ? JSON.parse(savedMy) : [];
      const savedAll = localStorage.getItem('twishiyat_orders') || localStorage.getItem('twasha_orders');
      if (savedAll && myOrders.length > 0) {
        const allOrders = JSON.parse(savedAll);
        const map = new Map(allOrders.map((o) => [o.id, o]));
        return myOrders.map((ord) => {
          const live = map.get(ord.id);
          if (live) {
            return {
              ...ord,
              status: live.status,
              statusLabel: live.statusLabel,
              carrier: live.carrier || ord.carrier,
              timeline: live.timeline || ord.timeline
            };
          }
          return ord;
        });
      }
      return myOrders;
    } catch (e) {
      return [];
    }
  });

  // Real-time synchronization listener for order status changes dispatched from Espace Pro
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      if (e.detail?.orderId) {
        setCustomerOrders((prev) =>
          prev.map((ord) => {
            if (ord.id === e.detail.orderId) {
              return {
                ...ord,
                status: e.detail.newStatus,
                statusLabel: e.detail.statusLabel,
                timeline: e.detail.timeline
              };
            }
            return ord;
          })
        );
      }
    };

    window.addEventListener('twishiyat_order_updated', handleOrderUpdate);
    return () => window.removeEventListener('twishiyat_order_updated', handleOrderUpdate);
  }, []);

  const recordCustomerOrder = (newOrder) => {
    const orderWithAttribution = {
      ...newOrder,
      utmSource: utmParams?.utm_source,
      utmCampaign: utmParams?.utm_campaign,
      utmParams: utmParams && Object.keys(utmParams).length > 0 ? utmParams : undefined
    };
    setCustomerOrders((prev) => {
      const updated = [orderWithAttribution, ...prev.filter(o => o.id !== newOrder.id)];
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
      const [routePart, queryString] = rawHash.split('?');
      const params = new URLSearchParams(queryString || window.location.search);

      // 1. Check path segments: e.g. "produit/montre-chrono-style" or "product/TD-W03"
      const segments = routePart.split('/').filter(Boolean);
      const firstSegment = segments[0] || '';
      const secondSegment = segments[1] || '';

      if (['produit', 'product', 'watches', 'bracelets', 'rings', 'sets'].includes(firstSegment) && secondSegment) {
        const found = products.find(
          (p) =>
            p.slug === secondSegment ||
            p.id === secondSegment ||
            (p.slug && p.slug.toLowerCase() === secondSegment.toLowerCase()) ||
            (p.id && p.id.toLowerCase() === secondSegment.toLowerCase())
        );
        if (found) {
          setSelectedProductId(found.id);
          setCurrentView('product');
          return;
        }
      }

      // 2. Query param deep linking: ?product=... or ?id=...
      const queryProd = params.get('product') || params.get('id') || params.get('p');
      if (queryProd) {
        const found = products.find(
          (p) =>
            p.id === queryProd ||
            p.slug === queryProd ||
            (p.slug && p.slug.toLowerCase() === queryProd.toLowerCase()) ||
            (p.id && p.id.toLowerCase() === queryProd.toLowerCase())
        );
        if (found) {
          setSelectedProductId(found.id);
          setCurrentView('product');
          return;
        }
      }

      // 3. Category & Collections deep linking
      if (['categorie', 'category', 'collection'].includes(firstSegment) && secondSegment) {
        setCategoryFilter(secondSegment);
        setCurrentView('catalog');
        return;
      }
      if (['boutique', 'catalog'].includes(firstSegment)) {
        setCurrentView('catalog');
        return;
      }

      // 4. Tracking
      if (['suivi', 'tracking'].includes(firstSegment)) {
        if (secondSegment) setSelectedOrderId(secondSegment);
        setCurrentView('tracking');
        return;
      }

      // 5. Account / Client
      if (['mon-compte', 'account'].includes(firstSegment)) {
        setCurrentView('account');
        return;
      }

      // 6. Admin / Espace Pro
      if (['espace-pro', 'admin'].includes(firstSegment) || ['espace-pro', 'admin'].includes(routePart)) {
        setCurrentView('admin');
        return;
      }

      // 7. Checkout & Confirmation
      if (['commander', 'checkout'].includes(firstSegment)) {
        setCurrentView('checkout');
        return;
      }
      if (['confirmation'].includes(firstSegment)) {
        setCurrentView('confirmation');
        return;
      }

      // Fallback to home if root or empty
      if (!rawHash) {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

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

  // Event deduplication cache
  const trackedEventKeys = React.useRef(new Set());

  const trackPixel = (type, data = {}) => {
    // Generate deduplication key for critical financial events (Purchase, InitiateCheckout)
    const dedupKey = type === 'Purchase' 
      ? `Purchase_${data.id || data.orderId || data.value}` 
      : (type === 'InitiateCheckout' ? `InitiateCheckout_${data.value}_${data.num_items}` : null);

    if (dedupKey && trackedEventKeys.current.has(dedupKey)) {
      console.log(`[Pixel] Deduplicated redundant event: ${dedupKey}`);
      return;
    }
    if (dedupKey) {
      trackedEventKeys.current.add(dedupKey);
    }

    const newEntry = {
      id: Date.now(),
      type,
      name: 'Meta Pixel / TikTok / GA4',
      data,
      time: new Date().toLocaleTimeString()
    };
    setPixelsLog((prev) => [newEntry, ...prev.slice(0, 19)]);

    // 1. Meta Pixel Bridge (window.fbq)
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        if (type === 'PageView') {
          window.fbq('track', 'PageView');
        } else if (type === 'ViewContent') {
          window.fbq('track', 'ViewContent', {
            content_name: data.name,
            content_ids: data.id ? [String(data.id)] : undefined,
            content_type: 'product',
            value: Number(data.price) || 0,
            currency: 'MAD'
          });
        } else if (type === 'AddToCart') {
          window.fbq('track', 'AddToCart', {
            content_name: data.name,
            content_ids: data.id ? [String(data.id)] : undefined,
            content_type: 'product',
            value: Number(data.price) * (Number(data.quantity) || 1),
            currency: 'MAD'
          });
        } else if (type === 'InitiateCheckout') {
          window.fbq('track', 'InitiateCheckout', {
            value: Number(data.value) || 0,
            currency: 'MAD',
            num_items: Number(data.num_items) || 1
          });
        } else if (type === 'Purchase') {
          window.fbq('track', 'Purchase', {
            value: Number(data.value) || 0,
            currency: 'MAD',
            content_type: 'product',
            transaction_id: String(data.id || data.orderId || '')
          });
        } else {
          window.fbq('trackCustom', type, data);
        }
      }
    } catch (e) {
      console.warn('[Pixel] Meta Pixel dispatch note:', e);
    }

    // 2. Google Analytics 4 Bridge (window.gtag)
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        if (type === 'PageView') {
          window.gtag('event', 'page_view');
        } else if (type === 'ViewContent') {
          window.gtag('event', 'view_item', {
            currency: 'MAD',
            value: Number(data.price) || 0,
            items: [{ item_id: String(data.id), item_name: data.name, price: data.price }]
          });
        } else if (type === 'AddToCart') {
          window.gtag('event', 'add_to_cart', {
            currency: 'MAD',
            value: Number(data.price) * (Number(data.quantity) || 1),
            items: [{ item_id: String(data.id), item_name: data.name, quantity: data.quantity || 1 }]
          });
        } else if (type === 'InitiateCheckout') {
          window.gtag('event', 'begin_checkout', {
            currency: 'MAD',
            value: Number(data.value) || 0
          });
        } else if (type === 'Purchase') {
          window.gtag('event', 'purchase', {
            transaction_id: String(data.id || data.orderId || ''),
            value: Number(data.value) || 0,
            currency: 'MAD'
          });
        }
      }
    } catch (e) {
      console.warn('[Pixel] GA4 dispatch note:', e);
    }

    // 3. Browser Custom Event for external hooks & testing
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('twishiyat_pixel_event', { detail: newEntry }));
      }
    } catch (e) {}
  };

  const navigateTo = (view, payload = null) => {
    if (view === 'product' && payload) {
      const prod = products.find((p) => p.id === payload || p.slug === payload);
      const prodId = prod ? prod.id : payload;
      const prodSlug = prod?.slug || prodId;
      setSelectedProductId(prodId);
      trackPixel('ViewContent', { id: prodId, name: prod?.name, price: prod?.price });
      setCurrentView('product');
      window.location.hash = `#/produit/${prodSlug}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'tracking') {
      if (payload) setSelectedOrderId(payload);
      setCurrentView('tracking');
      window.location.hash = payload ? `#/suivi/${payload}` : '#/suivi';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'catalog') {
      if (payload) setCategoryFilter(payload);
      trackPixel('ViewCategory', { category: payload || 'all' });
      setCurrentView('catalog');
      window.location.hash = payload && payload !== 'all' ? `#/collection/${payload}` : '#/boutique';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'admin') {
      setCurrentView('admin');
      window.location.hash = '#/espace-pro';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'account') {
      setCurrentView('account');
      window.location.hash = '#/mon-compte';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'checkout') {
      setCurrentView('checkout');
      window.location.hash = '#/commander';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'confirmation') {
      setCurrentView('confirmation');
      window.location.hash = '#/confirmation';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'home') {
      setCurrentView('home');
      history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.location.hash = `#${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, quantity = 1, variant = null, size = null) => {
    if (product.stock !== undefined && Number(product.stock) <= 0) {
      addToast(
        language === 'ar'
          ? 'عذراً، هذا المنتج غير متوفر في المخزون حالياً.'
          : 'Ce produit est actuellement en rupture temporaire de stock.',
        'error'
      );
      return false;
    }

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
    return true;
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
    const clean = code ? code.trim().toUpperCase() : '';
    if (!clean) return false;

    // 1. Retrieve coupons dynamically from Espace Pro storage
    let availableCoupons = [];
    try {
      const saved = localStorage.getItem('twishiyat_coupons') || localStorage.getItem('twasha_coupons');
      if (saved) {
        availableCoupons = JSON.parse(saved);
      }
    } catch (e) {}

    if (!Array.isArray(availableCoupons) || availableCoupons.length === 0) {
      availableCoupons = [
        { code: 'TWISHIYAT10', type: 'percentage', value: 10, active: true },
        { code: 'MAROC', type: 'shipping', value: 0, active: true },
        { code: 'VIP20', type: 'percentage', value: 20, active: true }
      ];
    }

    // 2. Find matching coupon (exact or aliases)
    const matched = availableCoupons.find(
      (c) =>
        c.code.toUpperCase() === clean ||
        (clean === 'TWASHA10' && c.code.toUpperCase() === 'TWISHIYAT10') ||
        (clean === 'TW10' && c.code.toUpperCase() === 'TWISHIYAT10') ||
        (clean === 'CASA' && c.code.toUpperCase() === 'MAROC')
    );

    if (matched && matched.active !== false) {
      if (matched.type === 'percentage') {
        const val = Number(matched.value) || 10;
        setAppliedCoupon({
          code: matched.code,
          discountPercent: val,
          label: `${val}% de réduction immédiate`
        });
        addToast(
          language === 'ar'
            ? `تم تفعيل كود الخصم ${matched.code} بنجاح (-${val}%)!`
            : `Code promo ${matched.code} appliqué : -${val}% !`
        );
      } else {
        setAppliedCoupon({
          code: matched.code,
          freeShipping: true,
          label: 'Livraison Gratuite offerte'
        });
        addToast(
          language === 'ar'
            ? `تم تفعيل كود ${matched.code} : التوصيل مجاني!`
            : `Code ${matched.code} appliqué : Livraison gratuite offerte !`
        );
      }
      return true;
    } else if (matched && matched.active === false) {
      addToast(
        language === 'ar' ? 'رمز الكوبون هذا منتهي الصلاحية حالياً.' : 'Ce code promo est actuellement inactif ou expiré.',
        'error'
      );
      return false;
    } else {
      addToast(
        language === 'ar' ? 'رمز الكوبون غير صالح' : 'Code promo non valide ou expiré.',
        'error'
      );
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
        utmParams,
        customerProfile,
        updateCustomerProfile,
        customerOrders,
        recordCustomerOrder,
        totalVisitors,
        updateTotalVisitors,
        productViews,
        recordProductView
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
