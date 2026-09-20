import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { PRODUCTS } from '../../data/products';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Phone, 
  LogOut,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export default function AccountView() {
  const { wishlist, toggleWishlist, navigateTo, addToCart } = useStore();
  const { orders } = useAdmin();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'wishlist', 'addresses', 'profile'

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div style={{ padding: '50px 0 100px 0', background: '#FBF9F5' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Customer Header Banner */}
        <div style={{ background: 'var(--obsidian-950)', color: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--grad-gold)', color: 'var(--obsidian-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
              OB
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Othmane Bennani
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--gold-400)' }}>
                Membre Privilège TWASHA DEHBI • Casablanca
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigateTo('catalog')}
              className="btn-gold"
              style={{ fontSize: '0.85rem', padding: '10px 18px' }}
            >
              <ShoppingBag size={15} />
              <span>Commander un bijou</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'orders', label: `Mes Commandes (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Favoris (${wishlist.length})`, icon: Heart },
            { id: 'addresses', label: 'Adresses de Livraison', icon: MapPin },
            { id: 'profile', label: 'Informations Personnelles', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  color: isActive ? 'var(--gold-800)' : '#6B7280',
                  borderBottom: isActive ? '3px solid var(--gold-600)' : '3px solid transparent',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #EFEAE2',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Commande N°</span>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--obsidian-900)', margin: '2px 0' }}>
                      {ord.id}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        background: ord.status === 'delivered' ? '#D1FAE5' : '#FEF3C7',
                        color: ord.status === 'delivered' ? '#065F46' : '#92400E',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      {ord.statusLabel}
                    </span>

                    <button
                      className="btn-dark"
                      style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                      onClick={() => navigateTo('tracking', ord.id)}
                    >
                      <Truck size={14} />
                      <span>Suivre le colis</span>
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {ord.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                      <span>
                        <strong>{it.quantity}x</strong> {it.name} {it.variant ? `(${it.variant})` : ''}
                      </span>
                      <span style={{ fontWeight: '700', color: 'var(--obsidian-900)' }}>
                        {it.price * it.quantity} DH
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '12px', fontSize: '0.82rem', color: '#6B7280' }}>
                  <span>📍 {ord.customer.city} ({ord.customer.address})</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                    Total : {ord.total} DH (Paiement COD)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFEAE2' }}>
                <Heart size={44} color="#D1D5DB" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Votre liste d'envies est vide</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Enregistrez vos coups de cœur en cliquant sur le cœur sur n'importe quel bijou.
                </p>
                <button className="btn-gold" onClick={() => navigateTo('catalog')}>
                  Découvrir la collection
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container" onClick={() => navigateTo('product', product.id)}>
                      <img src={product.image} alt={product.name} className="product-image" />
                      <button
                        className="product-wishlist-btn active"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                      >
                        <Heart size={18} fill="#DC2626" />
                      </button>
                    </div>
                    <div className="product-info">
                      <span className="product-category-tag">{product.category}</span>
                      <h3 className="product-title" onClick={() => navigateTo('product', product.id)}>
                        {product.name}
                      </h3>
                      <div className="product-price-row">
                        <span className="product-current-price">{product.price} DH</span>
                      </div>
                      <button
                        className="btn-gold"
                        style={{ width: '100%', padding: '9px', fontSize: '0.85rem' }}
                        onClick={() => addToCart(product, 1)}
                      >
                        <ShoppingBag size={15} />
                        <span>Ajouter au Panier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--gold-500)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge-gold">Adresse Principale</span>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>✓ Vérifiée</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>Domicile Casablanca</h4>
              <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5' }}>
                24 Rue Abou Al Alaa Al Maarri, Maarif<br />
                Casablanca 20100<br />
                Téléphone : 06 61 24 58 90
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge-dark">Bureau Rabat</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>Agence Agdal</h4>
              <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5' }}>
                Avenue Fal Ould Oumeir, N° 45<br />
                Rabat Agdal<br />
                Téléphone : 06 61 24 58 90
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Profile Info */}
        {activeTab === 'profile' && (
          <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #EFEAE2', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Mes Informations Personnelles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Nom Complet</label>
                <input type="text" readOnly value="Othmane Bennani" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#F9FAFB' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Numéro WhatsApp Marocain</label>
                <input type="text" readOnly value="06 61 24 58 90" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#F9FAFB' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Email</label>
                <input type="text" readOnly value="othmane.bennani@gmail.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#F9FAFB' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Devise Préférée</label>
                <input type="text" readOnly value="MAD (Dirham Marocain)" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#F9FAFB' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
