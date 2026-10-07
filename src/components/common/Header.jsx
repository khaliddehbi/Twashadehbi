import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import brandLogo from '../../assets/images/logo.png';
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

const InstagramIcon = ({ size = 16, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 16, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

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
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside aria-label="Annonces promotionnelles" className="announcement-bar">
        <div className="container announcement-inner">
          <div className="announcement-left">
            <div className="announcement-center">
              <span>{t('announcement')}</span>
            </div>

            <div className="announcement-socials">
              <a
                href="https://www.instagram.com/twishiyat_/"
                target="_blank"
                rel="me noopener noreferrer"
                title="Page Instagram @twishiyat_"
                className="announcement-social-link"
              >
                <InstagramIcon size={12} />
                <span>@twishiyat_</span>
              </a>
              <span className="announcement-divider">•</span>
              <a
                href="https://www.facebook.com/profile.php?id=61594978681127"
                target="_blank"
                rel="me noopener noreferrer"
                title="Page Facebook TWISHIYAT"
                className="announcement-social-link"
              >
                <FacebookIcon size={12} />
                <span>Facebook</span>
              </a>
            </div>
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
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo & Monogram */}
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <img src={brandLogo} alt="TWISHIYAT Logo" className="brand-crest-img" />
            <div className="brand-text">
              <span className="brand-name">TWISHIYAT</span>
              <span className="brand-arabic">توشيات • Montres & Bijoux</span>
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
              <Search size={19} />
            </button>

            {/* Customer Account */}
            <button
              className="icon-btn header-account-btn"
              onClick={() => navigateTo('account')}
              aria-label="Mon Compte"
              title="Mon Compte"
            >
              <User size={19} />
            </button>

            {/* Wishlist */}
            <button
              className="icon-btn header-wishlist-btn"
              onClick={() => navigateTo('account')}
              aria-label="Liste d'envies"
              title="Coups de Cœur"
            >
              <Heart size={19} />
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              className="icon-btn header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              style={{ background: 'var(--obsidian-900)', color: 'var(--gold-400)', width: 'auto', padding: '8px 12px', borderRadius: '30px' }}
              aria-label="Panier d'achats"
            >
              <ShoppingBag size={18} />
              <span className="header-cart-total" style={{ fontSize: '0.84rem', fontWeight: '700', marginLeft: '6px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
              <button
                onClick={() => { navigateTo('tracking'); setMobileMenuOpen(false); }}
                className="btn-dark"
                style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <Truck size={15} />
                <span>{t('navTracking')}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <a
                  href="https://www.instagram.com/twishiyat_/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#FDF2F4',
                    border: '1px solid #FBCFE8',
                    color: '#BE185D',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  <InstagramIcon size={15} color="#BE185D" />
                  <span>@twishiyat_</span>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61594978681127"
                  target="_blank"
                  rel="me noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  <FacebookIcon size={15} color="#1D4ED8" />
                  <span>Facebook</span>
                </a>
              </div>

              {/* Mobile Drawer Language & Currency Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F9FAFB', borderRadius: '10px', marginTop: '6px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={15} color="var(--gold-600)" />
                  <button onClick={() => setLanguage('fr')} style={{ fontWeight: language === 'fr' ? '800' : '400', color: language === 'fr' ? 'var(--gold-700)' : '#4B5563', fontSize: '0.82rem' }}>FR</button>
                  <span style={{ color: '#D1D5DB' }}>|</span>
                  <button onClick={() => setLanguage('ar')} style={{ fontWeight: language === 'ar' ? '800' : '400', color: language === 'ar' ? 'var(--gold-700)' : '#4B5563', fontSize: '0.82rem', fontFamily: 'var(--font-arabic)' }}>العربية</button>
                  <span style={{ color: '#D1D5DB' }}>|</span>
                  <button onClick={() => setLanguage('en')} style={{ fontWeight: language === 'en' ? '800' : '400', color: language === 'en' ? 'var(--gold-700)' : '#4B5563', fontSize: '0.82rem' }}>EN</button>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--gold-800)' }}>🇲🇦 MAD (DH)</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <style>{`
        .announcement-bar {
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
          background: var(--obsidian-950);
        }
        .announcement-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 6px 14px;
        }
        .announcement-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }
        .announcement-center {
          font-size: 0.76rem;
          color: var(--gold-400);
          letter-spacing: 0.02em;
          font-weight: 600;
        }
        .announcement-socials {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .announcement-social-link {
          color: var(--gold-400);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          text-decoration: none;
        }
        .announcement-divider {
          color: #555;
        }

        @media (max-width: 860px) {
          .announcement-socials {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .announcement-bar {
            padding: 6px 8px !important;
          }
          .announcement-inner {
            justify-content: center !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .announcement-left {
            justify-content: center !important;
            width: 100% !important;
            max-width: 100% !important;
            gap: 0 !important;
            min-width: 0 !important;
          }
          .announcement-center {
            width: 100% !important;
            max-width: 100% !important;
            text-align: center !important;
            font-size: 0.69rem !important;
            white-space: normal !important;
            line-height: 1.25 !important;
            padding: 0 4px !important;
            overflow: visible !important;
          }
          .announcement-actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
