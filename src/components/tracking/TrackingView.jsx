import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function TrackingView() {
  const { selectedOrderId, setSelectedOrderId, language, t } = useStore();
  const { orders } = useAdmin();

  const [orderQuery, setOrderQuery] = useState(selectedOrderId || 'TD-8492');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(
    orders.find(o => o.id === (selectedOrderId || 'TD-8492')) || orders[0]
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = orderQuery.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === cleanId);
    
    if (found) {
      setSearchedOrder(found);
      setSelectedOrderId(found.id);
    } else {
      setErrorMessage(`Aucune commande trouvée avec le numéro "${cleanId}". Essayez TD-8492 ou TD-8475.`);
    }
  };

  return (
    <div style={{ padding: '50px 0 100px 0', background: '#FBF9F5' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--sand-100)', border: '1px solid var(--border-gold)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Truck size={28} />
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--obsidian-950)', marginBottom: '10px' }}>
            {t('trackingTitle')}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
            Suivez l'acheminement de votre colis en direct partout au Royaume du Maroc.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE2', boxShadow: 'var(--shadow-sm)', marginBottom: '40px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="N° de commande (ex: TD-8492)"
                style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '13px 28px' }}>
              <Search size={18} />
              <span>{t('trackNow')}</span>
            </button>
          </form>

          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.85rem', marginTop: '12px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Pickers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: '#9CA3AF', flexWrap: 'wrap' }}>
            <span>Tester une commande de démo :</span>
            {['TD-8492', 'TD-8475', 'TD-8410', 'TD-8498'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setOrderQuery(id);
                  const found = orders.find(o => o.id === id);
                  if (found) setSearchedOrder(found);
                }}
                style={{ background: '#F3EFEA', padding: '4px 10px', borderRadius: '6px', color: 'var(--obsidian-900)', fontWeight: '600' }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Order Status Result Card */}
        {searchedOrder && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEAE2', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
            {/* Top Info Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--gold-700)', fontWeight: '700' }}>
                  Colis en Transit
                </span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--obsidian-900)', margin: '4px 0' }}>
                  Commande {searchedOrder.id}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Destinataire : <strong>{searchedOrder.customer.fullName}</strong> • 📍 {searchedOrder.customer.city}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span 
                  style={{
                    background: searchedOrder.status === 'delivered' ? '#D1FAE5' : '#FEF3C7',
                    color: searchedOrder.status === 'delivered' ? '#065F46' : '#92400E',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'inline-block'
                  }}
                >
                  {searchedOrder.statusLabel}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#9CA3AF', marginTop: '6px' }}>
                  Transporteur : {searchedOrder.carrier}
                </span>
              </div>
            </div>

            {/* Visual 6-Stage Moroccan Logistics Stepper */}
            <div style={{ padding: '36px 0 20px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                {searchedOrder.timeline && searchedOrder.timeline.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurr = step.current;

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
                      {/* Step Indicator Dot / Icon */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--gold-500)' : (isCurr ? 'var(--obsidian-900)' : '#E5E7EB'),
                          color: isDone ? 'var(--obsidian-950)' : (isCurr ? 'var(--gold-400)' : '#9CA3AF'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: isCurr ? '0 0 12px rgba(212,175,55,0.4)' : 'none',
                          zIndex: 2
                        }}
                      >
                        {isDone ? <CheckCircle2 size={20} /> : <Clock size={18} />}
                      </div>

                      {/* Step Content */}
                      <div style={{ flexGrow: 1, paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: isCurr ? '700' : '600', color: isCurr ? 'var(--gold-800)' : 'var(--obsidian-900)' }}>
                            {step.title}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: isCurr ? 'var(--gold-700)' : '#9CA3AF', fontWeight: isCurr ? '700' : '400' }}>
                            {step.date}
                          </span>
                        </div>
                        {isCurr && (
                          <span style={{ display: 'inline-block', fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', fontWeight: '600' }}>
                            Étape active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Driver Card (If out for delivery) */}
            {searchedOrder.driver && (
              <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '16px 20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--obsidian-900)', color: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--obsidian-900)', margin: 0 }}>
                      Livreur Assigné : {searchedOrder.driver.name}
                    </h5>
                    <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      En route avec votre colis à {searchedOrder.customer.city}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${searchedOrder.driver.phone}`}
                  className="btn-gold"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  <Phone size={14} />
                  <span>Appeler le livreur</span>
                </a>
              </div>
            )}

            {/* Order Items Recap */}
            <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '24px', paddingTop: '20px' }}>
              <h5 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Articles dans cette commande ({searchedOrder.items.length})
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                    <span>
                      <strong>{item.quantity}x</strong> {item.name} {item.variant ? `(${item.variant})` : ''}
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--obsidian-900)' }}>
                      {item.price * item.quantity} DH
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '4px', fontWeight: '800', fontSize: '1rem', color: 'var(--obsidian-950)' }}>
                  <span>Total à régler en espèces :</span>
                  <span>{searchedOrder.total} DH</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
