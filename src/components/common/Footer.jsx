import React from 'react';
import { useStore } from '../../context/StoreContext';
import brandLogo from '../../assets/images/logo.png';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink
} from 'lucide-react';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function Footer() {
  const { t, navigateTo } = useStore();

  return (
    <footer style={{ background: 'var(--obsidian-950)', color: '#D1D5DB', borderTop: '1px solid rgba(212, 175, 55, 0.25)', marginTop: '60px' }}>
      {/* Moroccan Trust & Reassurance Badges Banner */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <Truck size={24} />
              </div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '600' }}>Livraison Rapide Maroc</h4>
              <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>24h Casablanca / 48h Amana & Cathedis dans toutes les villes</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '600' }}>Paiement à la Livraison</h4>
              <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Ouvrez et vérifiez votre colis avant de payer au livreur</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <RotateCcw size={24} />
              </div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '600' }}>Garantie & Échange 7 Jours</h4>
              <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Échange facile ou remboursement sans tracas</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <Phone size={24} />
              </div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '600' }}>Service Client WhatsApp</h4>
              <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Conseillers dédiés disponibles 7j/7 au 07 08 75 95 10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '60px 20px 40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={brandLogo}
                alt="TWISHIYAT"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--gold-500)',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
                  background: '#F7F3EC',
                  flexShrink: 0
                }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.08em', display: 'block', lineHeight: 1.1 }}>
                  TWISHIYAT
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', letterSpacing: '0.05em' }}>
                  توشيات • Montres & Bracelets
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '20px' }}>
              {t('footerAbout')}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://www.instagram.com/twishiyat_/"
                target="_blank"
                rel="noreferrer"
                title="Page Instagram Officielle @twishiyat_"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'var(--gold-400)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594978681127"
                target="_blank"
                rel="noreferrer"
                title="Page Facebook Officielle TWISHIYAT"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#1877F2'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'var(--gold-400)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://wa.me/212708759510"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Direct : 07 08 75 95 10"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)'; e.currentTarget.style.color = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--gold-300)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              {t('quickLinks')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('catalog', 'watches'); }} style={{ color: '#9CA3AF' }} onMouseOver={(e) => e.target.style.color = '#FFFFFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Montres de Précision
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('catalog', 'bracelets'); }} style={{ color: '#9CA3AF' }} onMouseOver={(e) => e.target.style.color = '#FFFFFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Bracelets & Joncs Ciselés
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('catalog', 'rings'); }} style={{ color: '#9CA3AF' }} onMouseOver={(e) => e.target.style.color = '#FFFFFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Bagues & Chevalières
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('catalog', 'sets'); }} style={{ color: '#9CA3AF' }} onMouseOver={(e) => e.target.style.color = '#FFFFFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Coffrets Cadeaux Prestiges
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('tracking'); }} style={{ color: 'var(--gold-400)' }}>
                  Suivi de Commande en Direct
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Casablanca Showroom */}
          <div>
            <h4 style={{ color: 'var(--gold-300)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              {t('customerService')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Showroom & Hub : Boulevard Al Massira Al Khadra, Maarif, Casablanca 20100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <span>+212 7 08 75 95 10 (WhatsApp Direct)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <a href="mailto:twishiyatcontact@gmail.com" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--gold-400)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                  twishiyatcontact@gmail.com
                </a>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', marginTop: '6px' }}>
                <span style={{ color: 'var(--gold-300)', fontWeight: '600', fontSize: '0.8rem' }}>
                  🇲🇦 Service Client 100% Marocain
                </span>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>
                  Disponible du Lundi au Samedi de 09h00 à 20h00
                </p>
              </div>
            </div>
          </div>

          {/* Carriers & Payment Logistics */}
          <div>
            <h4 style={{ color: 'var(--gold-300)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              Expédition & Partenaires
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '16px' }}>
              Nos colis sont acheminés et distribués en mains propres avec nos partenaires logistiques agréés :
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{ background: '#FFFFFF', color: '#1F2937', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                AMANA Express
              </span>
              <span style={{ background: '#FFFFFF', color: '#1F2937', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                CATHEDIS
              </span>
              <span style={{ background: '#FFFFFF', color: '#1F2937', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                GHAZALA
              </span>
              <span style={{ background: '#FFFFFF', color: '#1F2937', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                COD Maroc
              </span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)', display: 'block', marginBottom: '4px' }}>
                Paiement Sécurisé
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                Espèces à la livraison • CMI Carte Bancaire • Virement Wafacash / CIH
              </span>
            </div>
          </div>
        </div>

        {/* Copyright & Subfooter */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '50px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          <div>
            © {new Date().getFullYear()} TWISHIYAT. {t('allRightsReserved')}
          </div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#9CA3AF' }}>{t('terms')}</a>
            <span>•</span>
            <a href="#" style={{ color: '#9CA3AF' }}>{t('privacy')}</a>
            <span>•</span>
            <a href="#" style={{ color: '#9CA3AF' }}>{t('returns')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
