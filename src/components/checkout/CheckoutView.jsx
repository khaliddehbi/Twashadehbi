import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { MOROCCAN_CITIES, validateMoroccanPhone } from '../../data/moroccanCities';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Gift, 
  Tag, 
  Check,
  AlertCircle
} from 'lucide-react';

export default function CheckoutView() {
  const { 
    cart, 
    cartSubtotal, 
    discountAmount, 
    appliedCoupon, 
    applyCouponCode, 
    isFreeShipping, 
    navigateTo, 
    addToast,
    trackPixel,
    setLastPlacedOrder,
    setCart
  } = useStore();

  const { addOrder } = useAdmin();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card'
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery calculation
  const cityData = MOROCCAN_CITIES.find(c => c.name === city) || MOROCCAN_CITIES[0];
  const standardDeliveryFee = (cartSubtotal >= 350 || isFreeShipping) ? 0 : cityData.deliveryFee;
  const giftBoxFee = includeGiftBox ? 29 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + standardDeliveryFee + giftBoxFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    applyCouponCode(couponCodeInput);
    setCouponCodeInput('');
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      addToast('Votre panier est vide.', 'error');
      navigateTo('catalog');
      return;
    }

    if (!fullName.trim()) {
      addToast('Veuillez renseigner votre nom complet.', 'error');
      return;
    }

    if (!validateMoroccanPhone(phone)) {
      addToast('Numéro de téléphone marocain invalide. Exemple : 06 61 24 58 90', 'error');
      return;
    }

    if (!address.trim()) {
      addToast('Veuillez préciser votre adresse de livraison.', 'error');
      return;
    }

    setIsSubmitting(true);
    trackPixel('InitiateCheckout', { value: finalTotal, num_items: cart.length });

    const orderId = `TD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        fullName,
        phone,
        city,
        address,
        neighborhood,
        notes: orderNotes
      },
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        variant: i.variant?.name || '',
        size: i.size || '',
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      subtotal: cartSubtotal,
      deliveryFee: standardDeliveryFee,
      discount: discountAmount,
      giftBoxFee,
      total: finalTotal,
      paymentMethod,
      status: 'pending_confirmation',
      statusLabel: 'En attente de confirmation par WhatsApp / Téléphone',
      carrier: `Amana / Cathedis (${city})`,
      timeline: [
        { status: 'received', title: 'Commande Enregistrée', date: 'À l’instant', completed: true, current: true },
        { status: 'confirmed', title: 'Confirmation téléphonique en cours', date: 'Sous 15 min', completed: false },
        { status: 'processing', title: 'Préparation et emballage soigné', date: 'Aujourd’hui', completed: false },
        { status: 'shipped', title: `Expédition vers ${city}`, date: cityData.deliveryHours, completed: false },
        { status: 'delivered', title: 'Livraison & Paiement espèces au livreur', date: `Prévue sous ${cityData.deliveryHours}`, completed: false }
      ]
    };

    setTimeout(() => {
      addOrder(newOrder);
      setLastPlacedOrder(newOrder);
      trackPixel('Purchase', { id: orderId, value: finalTotal, currency: 'MAD' });
      setCart([]); // Empty cart
      setIsSubmitting(false);
      navigateTo('confirmation', orderId);
    }, 700);
  };

  return (
    <div style={{ padding: '40px 0 90px 0', background: '#FBF9F5' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Back Link */}
        <button
          onClick={() => navigateTo('catalog')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.88rem', fontWeight: '500', marginBottom: '24px' }}
        >
          <ArrowLeft size={16} />
          <span>Continuer mes achats</span>
        </button>

        <h1 style={{ fontSize: '2.2rem', color: 'var(--obsidian-950)', marginBottom: '8px' }}>
          Finaliser ma Commande
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '32px' }}>
          Remplissez vos informations de livraison au Maroc. Aucun paiement en ligne n'est exigé : vous payez à la réception.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
          {/* Left Column: Moroccan Checkout Form */}
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #EFEAE2', boxShadow: 'var(--shadow-sm)' }}>
            <form onSubmit={handleSubmitOrder}>
              {/* Section 1: Customer Contact */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--obsidian-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--obsidian-900)', color: 'var(--gold-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                  <span>Coordonnées & Téléphone Maroc</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                      Nom et Prénom complets *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ex: Karim El Idrissi"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                      Numéro de Téléphone (WhatsApp actif) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 XX XX XX XX ou 07 XX XX XX XX"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                      Notre livreur vous appellera sur ce numéro avant de se présenter à votre domicile.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Moroccan Shipping Address */}
              <div style={{ marginBottom: '28px', borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--obsidian-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--obsidian-900)', color: 'var(--gold-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                  <span>Adresse de Livraison au Maroc</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                        Ville au Maroc *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', background: '#FFF', outline: 'none' }}
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.deliveryHours})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                        Quartier / Secteur
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="ex: Maarif, Agdal, Guéliz..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                      Adresse précise (Rue, N° Immeuble, Résidence, Appartement) *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="ex: Résidence Al Andalous, Immeuble B, Apt 6"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--obsidian-800)', display: 'block', marginBottom: '6px' }}>
                      Instructions pour le livreur (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="ex: Appelez-moi quand vous êtes devant l'immeuble"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div style={{ marginBottom: '28px', borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--obsidian-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--obsidian-900)', color: 'var(--gold-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
                  <span>Mode de Règlement</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* COD Cash on delivery option - Default & Highlighted */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      border: paymentMethod === 'cod' ? '2px solid var(--gold-600)' : '1px solid #D1D5DB',
                      background: paymentMethod === 'cod' ? 'var(--gold-50)' : '#FFFFFF',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      boxShadow: paymentMethod === 'cod' ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ marginTop: '3px', accentColor: 'var(--gold-600)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Banknote size={18} color="var(--gold-700)" />
                        <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--obsidian-900)' }}>
                          Paiement en espèces à la livraison (Recommandé)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '4px' }}>
                        Payez directement au livreur après avoir ouvert et inspecté votre colis. Zéro risque.
                      </p>
                    </div>
                  </label>

                  {/* Card payment option */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      border: paymentMethod === 'card' ? '2px solid var(--gold-600)' : '1px solid #D1D5DB',
                      background: paymentMethod === 'card' ? 'var(--gold-50)' : '#FFFFFF',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      style={{ marginTop: '3px', accentColor: 'var(--gold-600)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} color="#4B5563" />
                        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--obsidian-900)' }}>
                          Carte Bancaire Marocaine ou Internationale (CMI)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>
                        Paiement sécurisé crypté SSL via le Centre Monétique Interbancaire (CMI).
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Bump Upsell */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                  border: '1.5px dashed var(--gold-500)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer'
                }}
                onClick={() => setIncludeGiftBox(!includeGiftBox)}
              >
                <input
                  type="checkbox"
                  checked={includeGiftBox}
                  onChange={(e) => setIncludeGiftBox(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--gold-600)', cursor: 'pointer' }}
                />
                <Gift size={26} color="var(--gold-700)" style={{ flexShrink: 0 }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--obsidian-900)' }}>
                      Ajouter l'Écrin Cadeau Velours Royal
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--gold-800)' }}>
                      +29 DH
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '2px' }}>
                    Boîte rigide en velours noir et or avec ruban satiné et sac de luxe Twasha Dehbi.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '8px' }}
              >
                <Check size={22} />
                <span>
                  {isSubmitting ? 'Traitement en cours...' : 'CONFIRMER MA COMMANDE (PAIEMENT À LA LIVRAISON)'}
                </span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: '#4B5563' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Garantie 1 An • Inspection du colis avant tout paiement en espèces.</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE2', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--obsidian-900)', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
              Récapitulatif ({cart.reduce((a, b) => a + b.quantity, 0)} articles)
            </h3>

            {/* Cart Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                  <div style={{ flexGrow: 1, fontSize: '0.85rem' }}>
                    <h4 style={{ fontWeight: '600', color: 'var(--obsidian-900)' }}>{item.product.name}</h4>
                    <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                      Qté: {item.quantity} {item.variant?.name ? `• ${item.variant.name}` : ''}
                    </span>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {item.product.price * item.quantity} DH
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon input form */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                placeholder="Code promo (ex: TWASHA10)"
                style={{ flexGrow: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', textTransform: 'uppercase', outline: 'none' }}
              />
              <button type="submit" className="btn-dark" style={{ padding: '0 16px', fontSize: '0.82rem' }}>
                Appliquer
              </button>
            </form>

            {/* Financial Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: '600', color: 'var(--obsidian-900)' }}>{cartSubtotal} DH</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '600' }}>
                  <span>Réduction appliquée</span>
                  <span>-{discountAmount} DH</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>Frais de livraison ({city})</span>
                <span style={{ fontWeight: '600', color: standardDeliveryFee === 0 ? '#059669' : 'var(--obsidian-900)' }}>
                  {standardDeliveryFee === 0 ? 'GRATUIT' : `${standardDeliveryFee} DH`}
                </span>
              </div>

              {includeGiftBox && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-800)', fontWeight: '600' }}>
                  <span>Écrin Cadeau Prestige</span>
                  <span>+29 DH</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: '800', color: 'var(--obsidian-950)', borderTop: '1px solid #E5E7EB', paddingTop: '14px', marginTop: '6px' }}>
                <span>Total à la livraison :</span>
                <span style={{ color: 'var(--obsidian-950)' }}>{finalTotal} DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
