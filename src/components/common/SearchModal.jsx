import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { Search, X, ArrowRight, Star } from 'lucide-react';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, navigateTo, language, t } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isSearchOpen) return null;

  const results = searchTerm.trim() === '' ? [] : PRODUCTS.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameAr && p.nameAr.includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  });

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '650px', padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
            {language === 'ar' ? 'البحث في منتجات طواشة ذهبي' : 'Rechercher un bijou ou accessoire'}
          </span>
          <button onClick={() => setIsSearchOpen(false)} style={{ color: '#6B7280', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Input Field */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={20} color="var(--gold-500)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن ساعة، سوار، خاتم...' : 'Rechercher montre, bracelet jonc, bague onyx...'}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              fontSize: '1rem',
              border: '2px solid var(--border-gold)',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'inherit',
              background: '#FAF8F5'
            }}
          />
        </div>

        {/* Quick Suggestion Tags */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px', fontSize: '0.82rem' }}>
          <span style={{ color: '#9CA3AF' }}>Suggestions :</span>
          {['Montre Royale', 'Bracelet Jonc', 'Chevalière Onyx', 'Coffret Cadeau'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              style={{ background: '#F3EFEA', padding: '4px 10px', borderRadius: '16px', color: 'var(--obsidian-800)', border: '1px solid #E5E0D6' }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
          {searchTerm.trim() !== '' && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>
              <p>Aucun produit ne correspond à votre recherche "{searchTerm}".</p>
            </div>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                navigateTo('product', product.id);
                setIsSearchOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                borderBottom: '1px solid #F3F4F6'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }}
              />
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-700)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {product.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: '#F59E0B' }}>
                    <Star size={12} fill="#F59E0B" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--obsidian-900)' }}>
                  {language === 'ar' ? product.nameAr : product.name}
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: '700', color: 'var(--obsidian-900)', fontSize: '0.95rem' }}>
                    {product.price} DH
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                      {product.originalPrice} DH
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight size={18} color="var(--gold-600)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
