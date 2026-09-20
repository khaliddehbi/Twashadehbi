import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, X, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const { language } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const phoneNum = '212661245890'; // Moroccan mobile

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
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FFFFFF', border: '2px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075E54', fontWeight: 'bold' }}>
              TD
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                TWASHA DEHBI Concierge
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
                ? 'مرحباً بك في طواشة ذهبي! كيف يمكن لمستشارينا في الدار البيضاء مساعدتك اليوم؟'
                : 'Salam ! Bienvenue chez TWASHA DEHBI. Comment notre équipe à Casablanca peut-elle vous aider aujourd’hui ?'}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => openChat('Salam ! Je souhaite commander un bijou chez Twasha Dehbi avec paiement à la livraison.')}
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
                onClick={() => openChat('Salam ! J’ai une question sur les tailles et la garantie or 18k.')}
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
                <span>✨ Question sur les finitions & garantie</span>
                <Send size={14} color="#075E54" />
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ padding: '10px', textAlign: 'center', background: '#FFFFFF', fontSize: '0.72rem', color: '#9CA3AF', borderTop: '1px solid #F3F4F6' }}>
            Service client officiel TWASHA DEHBI • Casablanca
          </div>
        </div>
      )}
    </>
  );
}
