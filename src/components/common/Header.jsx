import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  SlidersHorizontal,
  Globe, 
  User, 
  ShieldCheck, 
  Truck
} from 'lucide-react';

export default function Header() {
  const { 
    language, 
    setLanguage, 
    t, 
    cartItemCount, 
    cartSubtotal,
    setIsCartOpen, 
    wishlist, 
    currentView, 
    navigateTo,
    setIsSearchOpen
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'navHome', view: 'home' },
    { key: 'navCatalog', view: 'catalog', payload: 'all' },
    { key: 'navWatches', view: 'catalog', payload: 'watches' },
    { key: 'navBracelets', view: 'catalog', payload: 'bracelets' },
    { key: 'navRings', view: 'catalog', payload: 'rings' },
    { key: 'navSets', view: 'catalog', payload: 'sets' },
    { key: 'navTracking', view: 'tracking' },
    { key: 'navAdmin', view: 'admin' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside aria-label="Annonces promotionnelles" className="announcement-bar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div className="announcement-center">
            <span>{t('announcement')}</span>
          </div>

          <div className="announcement-actions">
            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} color="var(--gold-400)" />
              <button 
                onClick={() => setLanguage('fr')} 
                style={{ 
                  color: language === 'fr' ? 'var(--gold-400)' : '#A3A3A3', 
                  fontWeight: language === 'fr' ? '700' : '400',
                  fontSize: '0.75rem' 
                }}
              >
                FR
              </button>
              <span style={{ color: '#555' }}>|</span>
              <button 
                onClick={() => setLanguage('ar')} 
                style={{ 
                  color: language === 'ar' ? 'var(--gold-400)' : '#A3A3A3', 
                  fontWeight: language === 'ar' ? '700' : '400',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                العربية
              </button>
              <span style={{ color: '#555' }}>|</span>
              <button 
                onClick={() => setLanguage('en')} 
                style={{ 
                  color: language === 'en' ? 'var(--gold-400)' : '#A3A3A3', 
                  fontWeight: language === 'en' ? '700' : '400',
                  fontSize: '0.75rem' 
                }}
              >
                EN
              </button>
            </div>

            <span style={{ color: '#444' }}>•</span>

            {/* Currency Tag */}
            <span style={{ color: 'var(--gold-400)', fontWeight: '600' }}>🇲🇦 MAD (DH)</span>

            <span style={{ color: '#444' }}>•</span>

            {/* Admin Quick Link */}
            <button 
              onClick={() => navigateTo('admin')}
              style={{ 
                background: 'rgba(212, 175, 55, 0.2)',
                color: 'var(--gold-300)',
                border: '1px solid var(--gold-500)',
                borderRadius: '16px',
                padding: '3px 10px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Portail Administration"
            >
              <SlidersHorizontal size={12} color="var(--gold-400)" />
              <span>{t('navAdmin')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Luxury Header */}
      <header className="header-wrapper">
        <div className="container header-inner">
          {/* Mobile Hamburger */}
          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo & Monogram */}
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <div className="brand-crest">
              <span>TD</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">TWASHA DEHBI</span>
              <span className="brand-arabic">طواشة ذهبي • MA</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    className={`nav-link ${currentView === item.view ? 'active' : ''}`}
                    onClick={() => navigateTo(item.view, item.payload)}
                  >
                    {t(item.key)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Icons */}
          <div className="header-icons">
            {/* Search Trigger */}
            <button 
              className="icon-btn" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Rechercher un bijou"
              title="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Customer Account */}
            <button 
              className="icon-btn" 
              onClick={() => navigateTo('account')}
              aria-label="Mon Compte"
              title="Mon Compte"
            >
              <User size={20} />
            </button>

            {/* Wishlist */}
            <button 
              className="icon-btn" 
              onClick={() => navigateTo('account')}
              aria-label="Liste d'envies"
              title="Coups de Cœur"
            >
              <Heart size={20} />
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </button>

            {/* Cart Drawer Trigger */}
            <button 
              className="icon-btn" 
              onClick={() => setIsCartOpen(true)}
              style={{ background: 'var(--obsidian-900)', color: 'var(--gold-400)', width: 'auto', padding: '8px 14px', borderRadius: '30px' }}
              aria-label="Panier d'achats"
            >
              <ShoppingBag size={19} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', marginLeft: '6px' }}>
                {cartSubtotal} DH
              </span>
              {cartItemCount > 0 && (
                <span className="icon-badge" style={{ position: 'static', marginLeft: '6px' }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            style={{ 
              background: '#FFFFFF', 
              borderTop: '1px solid var(--border-subtle)', 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                style={{ 
                  textAlign: 'left', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  padding: '10px 0',
                  borderBottom: '1px solid #F3F4F6',
                  color: 'var(--obsidian-900)'
                }}
                onClick={() => {
                  navigateTo(item.view, item.payload);
                  setMobileMenuOpen(false);
                }}
              >
                {t(item.key)}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
              <button 
                onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                className="btn-dark" 
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <SlidersHorizontal size={15} />
                <span>{t('navAdmin')}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .announcement-center {
            font-size: 0.72rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </>
  );
}
