import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function OrderConfirmationView() {
  const { lastPlacedOrder, navigateTo, language } = useStore();

  useEffect(() => {
    // Launch celebratory gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#ECC86A', '#0C0D0E', '#F3EFEA']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const order = lastPlacedOrder || {
    id: 'TD-8492',
    date: new Date().toISOString(),
    customer: {
      fullName: 'Client TWASHA DEHBI',
      phone: '0661245890',
      city: 'Casablanca',
      address: 'Adresse de livraison'
    },
    items: [
      { name: 'Montre Royale Saphir Or 18K', price: 499, quantity: 1 }
    ],
    total: 499,
    carrier: 'Cathedis Casablanca'
  };

  const handleWhatsAppConfirm = () => {
    const text = `Salam TWASHA DEHBI ! Je confirme ma commande N° ${order.id} pour un montant de ${order.total} DH à livrer à ${order.customer.city} (${order.customer.fullName}). Merci !`;
    window.open(`https://wa.me/212661245890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ padding: '60px 0 100px 0', background: '#FBF9F5' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        {/* Success Icon Crest */}
        <div 
          style={{ 
            width: '84px', 
            height: '84px', 
            borderRadius: '50%', 
            background: 'var(--grad-gold)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px auto',
            boxShadow: 'var(--shadow-gold)'
          }}
        >
          <CheckCircle2 size={46} color="var(--obsidian-950)" />
        </div>

        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--gold-700)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Confirmation de Commande
        </span>

        <h1 style={{ fontSize: '2.6rem', color: 'var(--obsidian-950)', margin: '8px 0 16px 0' }}>
          Merci pour votre commande !
        </h1>

        <p style={{ color: '#4B5563', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 32px auto' }}>
          Votre commande a été enregistrée avec succès. Notre équipe à Casablanca va vous appeler ou vous envoyer un message WhatsApp au <strong>{order.customer.phone}</strong> pour confirmer l'expédition.
        </p>

        {/* Order ID Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', border: '1.5px solid var(--border-gold)', padding: '12px 24px', borderRadius: '30px', boxShadow: 'var(--shadow-sm)', marginBottom: '40px' }}>
          <Package size={20} color="var(--gold-600)" />
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
            N° DE COMMANDE : {order.id}
          </span>
        </div>

        {/* Order Details Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEAE2', padding: '32px', textAlign: 'left', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--obsidian-900)', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
            Détails de l'Expédition
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', fontSize: '0.88rem', marginBottom: '24px' }}>
            <div>
              <span style={{ color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Destinataire</span>
              <strong style={{ color: 'var(--obsidian-900)' }}>{order.customer.fullName}</strong>
            </div>

            <div>
              <span style={{ color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Téléphone WhatsApp</span>
              <strong style={{ color: 'var(--obsidian-900)' }}>{order.customer.phone}</strong>
            </div>

            <div>
              <span style={{ color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Ville & Destination</span>
              <strong style={{ color: 'var(--obsidian-900)' }}>{order.customer.city} (Maroc)</strong>
            </div>

            <div>
              <span style={{ color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Mode de Règlement</span>
              <strong style={{ color: 'var(--gold-800)' }}>Espèces à la Livraison ({order.total} DH)</strong>
            </div>
          </div>

          <div style={{ background: '#FAF8F5', padding: '14px 18px', borderRadius: '8px', border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
              <strong>Rappel de confiance :</strong> Vous réglerez la somme de <strong>{order.total} DH</strong> au livreur après avoir ouvert et inspecté votre bijou.
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handleWhatsAppConfirm}
            style={{
              background: '#25D366',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
              cursor: 'pointer'
            }}
          >
            <Phone size={18} />
            <span>Valider immédiatement par WhatsApp</span>
          </button>

          <button
            className="btn-dark"
            style={{ padding: '14px 28px' }}
            onClick={() => navigateTo('tracking', order.id)}
          >
            <Truck size={18} />
            <span>Suivre mon colis en direct</span>
          </button>
        </div>
      </div>
    </div>
  );
}
