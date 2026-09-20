import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Phone, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Plus, 
  Tag, 
  Star,
  ExternalLink,
  ShieldCheck,
  FileText,
  X
} from 'lucide-react';

export default function AdminView() {
  const { 
    orders, 
    products, 
    reviews, 
    coupons, 
    updateOrderStatus, 
    updateProduct, 
    addNewProduct,
    kpis 
  } = useAdmin();

  const { addToast } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'coupons', 'reviews'
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [printableSlipOrder, setPrintableSlipOrder] = useState(null);

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('watches');
  const [newProdPrice, setNewProdPrice] = useState(349);
  const [newProdStock, setNewProdStock] = useState(10);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim() !== '') {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendWhatsAppConfirmation = (ord) => {
    const text = `Salam ${ord.customer.fullName} ! C’est TWASHA DEHBI. Nous avons bien reçu votre commande N° ${ord.id} d'un montant de ${ord.total} DH. Confirmez-vous la livraison à ${ord.customer.city} (${ord.customer.address}) ?`;
    window.open(`https://wa.me/212${ord.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName) return;

    addNewProduct({
      name: newProdName,
      nameAr: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: Math.round(Number(newProdPrice) * 1.4),
      stock: Number(newProdStock),
      gender: 'men',
      image: products[0].image,
      shortDescription: 'Nouvel accessoire haute joaillerie TWASHA DEHBI.'
    });

    setNewProductModal(false);
    setNewProdName('');
    addToast('Nouveau produit ajouté au catalogue avec succès !');
  };

  return (
    <div style={{ padding: '40px 0 100px 0', background: '#F8F9FA' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-gold">Backoffice Maroc</span>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Boutique Officielle Casablanca</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--obsidian-950)', margin: '4px 0' }}>
              Administration TWASHA DEHBI
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
              Gestion des commandes en espèces (COD), expéditions Amana/Cathedis et catalogue.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-gold"
              onClick={() => setNewProductModal(true)}
              style={{ fontSize: '0.85rem', padding: '10px 18px' }}
            >
              <Plus size={16} />
              <span>Nouveau Produit</span>
            </button>
          </div>
        </div>

        {/* Real-time Moroccan eCommerce KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {/* Total Revenue */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chiffre d'Affaires Total
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                {kpis.totalSales.toLocaleString()} DH
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <TrendingUp size={13} /> +18.4% ce mois
            </span>
          </div>

          {/* Total Orders */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Commandes Reçues
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--obsidian-950)' }}>
                {kpis.totalOrdersCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>commandes</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-700)', marginTop: '6px', display: 'block' }}>
              Panier moyen : <strong>{kpis.avgOrderValue} DH</strong>
            </span>
          </div>

          {/* COD Confirmation Rate */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Taux Confirmation COD
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669' }}>
                {kpis.codConfirmationRate}%
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '6px', display: 'block' }}>
              {kpis.pendingCount} commandes à appeler aujourd'hui
            </span>
          </div>

          {/* Logistics In Transit */}
          <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Colis En Cours de Livraison
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold-600)' }}>
                {kpis.shippedCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>en route</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', marginTop: '6px', display: 'block' }}>
              {kpis.deliveredCount} colis livrés et encaissés
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
          {[
            { id: 'orders', label: `Gestion des Commandes (${orders.length})` },
            { id: 'products', label: `Catalogue Produits (${products.length})` },
            { id: 'coupons', label: `Codes Promo & Offres (${coupons.length})` },
            { id: 'reviews', label: `Modération Avis (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.9rem',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--obsidian-800)',
                background: activeTab === tab.id ? 'var(--obsidian-900)' : '#FFFFFF',
                border: '1px solid #E5E7EB',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {/* Filter Toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Rechercher par N°, nom, ville..."
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'pending_confirmation', label: 'À Confirmer' },
                  { id: 'confirmed', label: 'Confirmées' },
                  { id: 'shipped', label: 'Expédiées' },
                  { id: 'delivered', label: 'Livrées' },
                  { id: 'cancelled', label: 'Annulées' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: orderStatusFilter === st.id ? 'var(--gold-50)' : '#F9FAFB',
                      color: orderStatusFilter === st.id ? 'var(--gold-800)' : '#4B5563',
                      border: orderStatusFilter === st.id ? '1px solid var(--gold-500)' : '1px solid #E5E7EB'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#FAF8F5', borderBottom: '1px solid #E5E7EB', color: '#6B7280', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Commande</th>
                    <th style={{ padding: '14px 20px' }}>Client & Contact</th>
                    <th style={{ padding: '14px 20px' }}>Ville & Adresse</th>
                    <th style={{ padding: '14px 20px' }}>Articles & Montant</th>
                    <th style={{ padding: '14px 20px' }}>Statut Expédition</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }}>
                      {/* Order ID & Date */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--obsidian-900)', display: 'block' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {new Date(ord.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--obsidian-900)', display: 'block' }}>
                          {ord.customer.fullName}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{ color: 'var(--gold-800)', fontWeight: '600' }}>
                            {ord.customer.phone}
                          </span>
                          <button
                            onClick={() => handleSendWhatsAppConfirmation(ord)}
                            style={{ background: '#25D366', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            title="Envoyer message WhatsApp de confirmation"
                          >
                            <Phone size={10} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>

                      {/* City & Address */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--obsidian-900)', display: 'block' }}>
                          📍 {ord.customer.city}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280', display: 'block', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ord.customer.address}
                        </span>
                      </td>

                      {/* Articles & Amount */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--obsidian-950)', display: 'block' }}>
                          {ord.total} DH
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {ord.items.length} article(s) • Espèces COD
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid #D1D5DB',
                            background: ord.status === 'delivered' ? '#ECFDF5' : (ord.status === 'pending_confirmation' ? '#FFFBEB' : '#FFFFFF'),
                            color: ord.status === 'delivered' ? '#065F46' : (ord.status === 'pending_confirmation' ? '#B45309' : 'var(--obsidian-900)'),
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending_confirmation">À confirmer (Appel)</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="processing">En préparation</option>
                          <option value="shipped">Expédiée (Transit)</option>
                          <option value="out_for_delivery">En cours de livraison</option>
                          <option value="delivered">Livrée & Encaissée</option>
                          <option value="cancelled">Annulée / Retour</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setPrintableSlipOrder(ord)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--obsidian-900)'
                          }}
                          title="Imprimer le bordereau d'expédition"
                        >
                          <Printer size={13} />
                          <span>Bordereau</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--obsidian-900)' }}>Gestion des Stocks & Tarifs (MAD)</h3>
              <button className="btn-gold" onClick={() => setNewProductModal(true)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Plus size={16} />
                <span>Ajouter un Produit</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {products.map((p) => (
                <div key={p.id} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px', display: 'flex', gap: '14px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flexGrow: 1, fontSize: '0.85rem' }}>
                    <h4 style={{ fontWeight: '700', color: 'var(--obsidian-900)', fontSize: '0.9rem', marginBottom: '4px' }}>{p.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-700)', textTransform: 'uppercase' }}>{p.category}</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Prix (DH)</label>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                          style={{ width: '70px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #D1D5DB', fontWeight: 'bold' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Stock Casa</label>
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })}
                          style={{ width: '60px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #D1D5DB', fontWeight: 'bold' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--obsidian-900)', marginBottom: '16px' }}>Codes Promotionnels Actifs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {coupons.map((c) => (
                <div key={c.code} style={{ border: '1.5px dashed var(--gold-500)', borderRadius: '10px', padding: '18px', background: 'var(--gold-50)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--obsidian-950)' }}>{c.code}</span>
                    <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>Actif</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: '4px 0' }}>
                    {c.type === 'percentage' ? `-${c.value}% de réduction immédiate` : 'Livraison gratuite partout au Maroc'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Utilisé {c.uses} fois</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--obsidian-900)', marginBottom: '16px' }}>Avis Clients Vérifiés ({reviews.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{r.customerName} (📍 {r.city})</strong>
                      <span style={{ color: '#F59E0B', fontSize: '0.8rem' }}>★ {r.rating}/5</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: '2px 0' }}>"{r.comment}"</p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{r.date}</span>
                  </div>
                  <span style={{ background: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                    Approuvé
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE MOROCCAN SHIPPING SLIP MODAL (Bordereau d'expédition) */}
      {printableSlipOrder && (
        <div className="modal-overlay" onClick={() => setPrintableSlipOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--obsidian-900)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>TWASHA DEHBI SARL</h2>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Bordereau d'Expédition & Encaissement COD</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{printableSlipOrder.id}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280' }}>Colis Express Maroc</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '6px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#6B7280' }}>EXPÉDITEUR :</strong>
                TWASHA DEHBI - Hub Casablanca<br />
                Bd Al Massira, Maarif, Casablanca<br />
                Tél : 06 61 24 58 90
              </div>
              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '6px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#6B7280' }}>DESTINATAIRE :</strong>
                <strong>{printableSlipOrder.customer.fullName}</strong><br />
                {printableSlipOrder.customer.address}<br />
                <strong>{printableSlipOrder.customer.city}</strong><br />
                Tél : <strong>{printableSlipOrder.customer.phone}</strong>
              </div>
            </div>

            <div style={{ border: '2px dashed var(--gold-600)', background: 'var(--gold-50)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase' }}>MONTANT TOTAL À ENCAISSER EN ESPÈCES :</span>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--obsidian-950)' }}>
                {printableSlipOrder.total} DH
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669' }}>Le client a le droit d'ouvrir le colis avant paiement.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-dark" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Imprimer le Bordereau</span>
              </button>
              <button className="btn-outline" onClick={() => setPrintableSlipOrder(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {newProductModal && (
        <div className="modal-overlay" onClick={() => setNewProductModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Ajouter un Nouveau Bijou</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="ex: Bague Royale Zellige Or 18k"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Catégorie</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="watches">Montres</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="rings">Bagues</option>
                    <option value="sets">Coffrets</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Prix de vente (DH) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Stock initial (Casablanca)</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                  Enregistrer le Produit
                </button>
                <button type="button" className="btn-outline" onClick={() => setNewProductModal(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
