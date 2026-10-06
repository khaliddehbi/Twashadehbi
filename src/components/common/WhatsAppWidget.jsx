import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, X, MessageCircle, Send, CheckCircle } from 'lucide-react';
import brandLogo from '../../assets/images/logo.png';

export default function WhatsAppWidget() {
  const { language } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const phoneNum = '212708759510'; // Moroccan mobile

  const openChat = (messageText) => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNum}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="floating-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        title="WhatsApp Concierge Maroc"
        aria-label="Contacter sur WhatsApp"
      >
        {isOpen ? <X size={28} /> : <Phone size={28} />}
      </button>

      {/* Concierge Dialog Card */}
      {isOpen && (
        <div 
          className="whatsapp-dialog-card"
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '24px',
            width: '340px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
            border: '1px solid #E5E7EB',
            zIndex: 95,
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease'
          }}
        >
          {/* Header */}
          <div style={{ background: '#075E54', color: '#FFFFFF', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={brandLogo}
              alt="TWISHIYAT"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #25D366',
                background: '#F7F3EC',
                flexShrink: 0
              }}
            />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                TWISHIYAT Service Client
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#A7F3D0', marginTop: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366' }}></span>
                <span>En ligne • Répond en 2 min</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '18px', background: '#F0F2F5' }}>
            <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '14px', fontSize: '0.85rem', color: '#1F2937' }}>
              {language === 'ar'
                ? 'مرحباً بك في تويشيات! كيف يمكننا مساعدتك اليوم؟'
                : 'Salam ! Bienvenue chez TWISHIYAT. Comment pouvons-nous vous aider aujourd’hui ?'}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => openChat('Salam ! Je souhaite commander chez TWISHIYAT avec paiement à la livraison.')}
                style={{
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                <span>🛍️ Passer une commande en direct</span>
                <Send size={14} color="#075E54" />
              </button>

              <button
                onClick={() => openChat('Salam ! Je souhaite avoir des informations sur le suivi de ma commande.')}
                style={{
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>📦 Suivi de mon colis (Amana / Cathedis)</span>
                <Send size={14} color="#075E54" />
              </button>

              <button
                onClick={() => openChat('Salam ! J’ai une question sur les modèles, finitions et tailles TWISHIYAT.')}
                style={{
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>✨ Question sur les finitions & authenticité</span>
                <Send size={14} color="#075E54" />
              </button>
            </div>
          </div>

          {/* Footer Note with Social Links */}
          <div style={{ padding: '10px 14px', textAlign: 'center', background: '#F9FAFB', fontSize: '0.74rem', color: '#6B7280', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span>Nos réseaux :</span>
            <a href="https://www.instagram.com/twishiyat_/" target="_blank" rel="noreferrer" style={{ color: '#E1306C', fontWeight: '600', textDecoration: 'none' }}>
              Instagram
            </a>
            <span>•</span>
            <a href="https://www.facebook.com/profile.php?id=61594978681127" target="_blank" rel="noreferrer" style={{ color: '#1877F2', fontWeight: '600', textDecoration: 'none' }}>
              Facebook
            </a>
          </div>
        </div>
      )}
    </>
  );
}
