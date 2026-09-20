import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { 
  Filter, 
  ArrowUpDown, 
  Star, 
  Heart, 
  ShoppingBag, 
  Eye, 
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export default function CatalogView() {
  const { 
    language, 
    t, 
    navigateTo, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setQuickViewProduct,
    categoryFilter,
    setCategoryFilter,
    genderFilter,
    setGenderFilter,
    priceRange,
    setPriceRange
  } = useStore();

  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'men' && product.gender !== 'men') return false;
      if (categoryFilter === 'women' && product.gender !== 'women') return false;
      if (!['men', 'women'].includes(categoryFilter) && product.category !== categoryFilter) return false;
    }

    // Gender filter
    if (genderFilter !== 'all' && product.gender !== genderFilter) return false;

    // Price range
    if (product.price > priceRange[1]) return false;

    // Stock
    if (inStockOnly && product.stock <= 0) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    return 0; // featured default
  });

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '8px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Accueil</span>
            <span>/</span>
            <span style={{ color: 'var(--obsidian-900)', fontWeight: '600' }}>Boutique</span>
            {categoryFilter !== 'all' && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--gold-700)', fontWeight: '600', textTransform: 'capitalize' }}>
                  {CATEGORIES.find(c => c.id === categoryFilter)?.name || categoryFilter}
                </span>
              </>
            )}
          </div>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--obsidian-950)', marginBottom: '8px' }}>
            {categoryFilter === 'all' 
              ? 'Toutes les Créations TWASHA DEHBI' 
              : (CATEGORIES.find(c => c.id === categoryFilter)?.name || 'Boutique')}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Montres de précision, bracelets et bagues en or 18k avec paiement à la livraison au Maroc.
          </p>
        </div>

        {/* Toolbar & Sort Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#FFFFFF', 
            padding: '16px 20px', 
            borderRadius: '10px', 
            border: '1px solid #EFEAE2', 
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-dark"
              style={{ display: 'none', padding: '8px 16px', fontSize: '0.82rem' }}
              id="mobile-filter-trigger"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter size={14} />
              <span>Filtres</span>
            </button>
            <span style={{ fontSize: '0.88rem', color: '#6B7280' }}>
              <strong>{sortedProducts.length}</strong> modèles disponibles
            </span>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowUpDown size={16} color="var(--gold-700)" />
            <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: '500' }}>Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                outline: 'none',
                background: '#FFFFFF',
                color: 'var(--obsidian-900)'
              }}
            >
              <option value="featured">Sélection TWASHA DEHBI</option>
              <option value="price-asc">Prix croissant (DH)</option>
              <option value="price-desc">Prix décroissant (DH)</option>
              <option value="rating">Meilleures notes clients</option>
              <option value="discount">Plus fortes réductions (%)</option>
            </select>
          </div>
        </div>

        {/* Main Grid Layout: Sidebar + Product Grid */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Desktop Filter Sidebar */}
          <aside
            style={{
              width: '260px',
              flexShrink: 0,
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #EFEAE2',
              padding: '24px',
              position: 'sticky',
              top: '100px'
            }}
            className="desktop-filter-sidebar"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={18} color="var(--gold-600)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>Filtres</h3>
              </div>
              {(categoryFilter !== 'all' || genderFilter !== 'all' || priceRange[1] < 1200) && (
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setGenderFilter('all');
                    setPriceRange([100, 1200]);
                    setInStockOnly(false);
                  }}
                  style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: '600' }}
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-700)', marginBottom: '12px' }}>
                Catégories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: categoryFilter === cat.id ? '700' : '400',
                      background: categoryFilter === cat.id ? 'var(--gold-50)' : 'transparent',
                      color: categoryFilter === cat.id ? 'var(--gold-800)' : 'var(--obsidian-800)',
                      textAlign: 'left'
                    }}
                  >
                    <span>{language === 'ar' ? cat.nameAr : cat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-700)', marginBottom: '12px' }}>
                Genre
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'men', label: 'Homme' },
                  { id: 'women', label: 'Femme' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGenderFilter(g.id)}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      textAlign: 'center',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: genderFilter === g.id ? '1px solid var(--gold-600)' : '1px solid #D1D5DB',
                      background: genderFilter === g.id ? 'var(--obsidian-900)' : '#FFFFFF',
                      color: genderFilter === g.id ? 'var(--gold-400)' : 'var(--obsidian-800)'
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-700)', marginBottom: '12px' }}>
                Prix Maximum : {priceRange[1]} DH
              </h4>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{ width: '100%', accentColor: 'var(--gold-500)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
                <span>200 DH</span>
                <span>1 200 DH</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--obsidian-800)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--gold-500)', width: '16px', height: '16px' }}
                />
                <span>En stock uniquement au Maroc</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div style={{ flexGrow: 1 }}>
            {sortedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFEAE2' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--obsidian-900)', marginBottom: '8px' }}>
                  Aucun bijou ne correspond à ces critères.
                </p>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Essayez de modifier vos filtres de prix ou de catégorie.
                </p>
                <button
                  className="btn-gold"
                  onClick={() => {
                    setCategoryFilter('all');
                    setGenderFilter('all');
                    setPriceRange([100, 1200]);
                  }}
                >
                  Afficher Tous Les Produits
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {sortedProducts.map((product) => {
                  const inWish = wishlist.includes(product.id);
                  return (
                    <div key={product.id} className="product-card">
                      <div 
                        className="product-image-container"
                        onClick={() => navigateTo('product', product.id)}
                      >
                        <img src={product.image} alt={product.name} className="product-image" />
                        
                        <div className="product-badges">
                          {product.badge && <span className="badge-gold">{product.badge}</span>}
                          {product.discountPercent && (
                            <span className="badge-sale">-{product.discountPercent}%</span>
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
                          <button
                            className="btn-gold"
                            style={{ flex: 1, padding: '9px 12px', fontSize: '0.8rem' }}
                            onClick={() => addToCart(product, 1)}
                          >
                            <ShoppingBag size={14} />
                            <span>{t('addToCart')}</span>
                          </button>
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
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-filter-sidebar {
            display: none !important;
          }
          #mobile-filter-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
