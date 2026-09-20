export const INITIAL_ORDERS = [
  {
    id: 'TD-8492',
    date: '2026-09-19T14:30:00Z',
    customer: {
      fullName: 'Othmane Bennani',
      phone: '0661245890',
      city: 'Casablanca',
      address: '24 Rue Abou Al Alaa Al Maarri, Maarif',
      neighborhood: 'Maarif Extension',
      notes: 'Sonner à l’interphone 4B ou appeler avant'
    },
    items: [
      {
        productId: 'TD-W01',
        name: 'Montre Royale Saphir Or 18K',
        variant: 'Or Jaune & Vert Émeraude',
        price: 499,
        quantity: 1,
        image: 'watch_gold.jpg'
      }
    ],
    subtotal: 499,
    deliveryFee: 0, // Free over 350 DH
    discount: 0,
    total: 499,
    paymentMethod: 'cod',
    status: 'out_for_delivery',
    statusLabel: 'En cours de livraison',
    carrier: 'Cathedis Express Casablanca',
    trackingNumber: 'CTH-CAS-92841',
    driver: {
      name: 'Simohamed (Livreur Casablanca Centre)',
      phone: '0672118844'
    },
    timeline: [
      { status: 'received', title: 'Commande Reçue', date: '19 Sept 14:30', completed: true },
      { status: 'confirmed', title: 'Confirmée par WhatsApp', date: '19 Sept 14:45', completed: true },
      { status: 'processing', title: 'Préparée en Hub Casablanca', date: '19 Sept 15:30', completed: true },
      { status: 'shipped', title: 'Prise en charge livreur', date: '19 Sept 16:15', completed: true },
      { status: 'out_for_delivery', title: 'Livreur en route vers votre adresse', date: '19 Sept 17:10', current: true },
      { status: 'delivered', title: 'Livraison & Encaissement espèces', date: 'Prévue avant 19h30', completed: false }
    ]
  },
  {
    id: 'TD-8475',
    date: '2026-09-18T18:15:00Z',
    customer: {
      fullName: 'Noura El Amrani',
      phone: '0663889922',
      city: 'Rabat',
      address: 'Avenue Fal Ould Oumeir, Résidence Al Manar Apt 12',
      neighborhood: 'Agdal',
      notes: 'Livraison après 16h si possible'
    },
    items: [
      {
        productId: 'TD-B01',
        name: 'Bracelet Jonc Zahra Ciselé Or 18K',
        variant: 'Or Jaune 18K / Taille M',
        price: 279,
        quantity: 1,
        image: 'bracelet_cuff.jpg'
      },
      {
        productId: 'TD-B03',
        name: 'Bracelet Trèfle Alhambra Nacre & Or',
        variant: 'Nacre Blanche & Or',
        price: 249,
        quantity: 1,
        image: 'jewelry_women.jpg'
      }
    ],
    subtotal: 528,
    deliveryFee: 0,
    discount: 52.8, // 10% promo
    total: 475.2,
    paymentMethod: 'cod',
    status: 'shipped',
    statusLabel: 'Expédiée avec Amana Express',
    carrier: 'Amana Poste Maroc',
    trackingNumber: 'AMN-RBT-48201',
    timeline: [
      { status: 'received', title: 'Commande Reçue', date: '18 Sept 18:15', completed: true },
      { status: 'confirmed', title: 'Confirmée par appel', date: '18 Sept 18:40', completed: true },
      { status: 'processing', title: 'Colis emballé & scellé', date: '19 Sept 09:00', completed: true },
      { status: 'shipped', title: 'En transit vers Hub Rabat Agdal', date: '19 Sept 11:30', current: true },
      { status: 'out_for_delivery', title: 'Distribution locale', date: 'Demain matin', completed: false },
      { status: 'delivered', title: 'Livrée & Encaissée', date: 'Demain', completed: false }
    ]
  },
  {
    id: 'TD-8410',
    date: '2026-09-17T11:20:00Z',
    customer: {
      fullName: 'Karim Alaoui',
      phone: '0661456789',
      city: 'Marrakech',
      address: 'Boulevard Mohamed V, Guéliz',
      neighborhood: 'Guéliz',
      notes: 'Colis vérifié et payé'
    },
    items: [
      {
        productId: 'TD-S01',
        name: 'Coffret Majestueux Twasha (Montre + Jonc Ciselé)',
        variant: 'Coffret Velours Noir & Or',
        price: 699,
        quantity: 1,
        image: 'gift_box.jpg'
      }
    ],
    subtotal: 699,
    deliveryFee: 0,
    discount: 0,
    total: 699,
    paymentMethod: 'cod',
    status: 'delivered',
    statusLabel: 'Livrée & Encaissée',
    carrier: 'Cathedis Marrakech',
    trackingNumber: 'CTH-RAK-33921',
    timeline: [
      { status: 'received', title: 'Commande Reçue', date: '17 Sept 11:20', completed: true },
      { status: 'confirmed', title: 'Confirmée', date: '17 Sept 11:35', completed: true },
      { status: 'processing', title: 'Préparée', date: '17 Sept 14:00', completed: true },
      { status: 'shipped', title: 'Expédiée', date: '17 Sept 17:00', completed: true },
      { status: 'out_for_delivery', title: 'En cours de livraison', date: '18 Sept 10:00', completed: true },
      { status: 'delivered', title: 'Colis Livré et Encaissé (699 DH)', date: '18 Sept 13:45', completed: true, current: true }
    ]
  },
  {
    id: 'TD-8498',
    date: '2026-09-19T16:50:00Z',
    customer: {
      fullName: 'Tariq Benjelloun',
      phone: '0662771144',
      city: 'Tanger',
      address: 'Résidence Malabata Hills, Bloc C',
      neighborhood: 'Malabata',
      notes: 'Appelez-moi 30 minutes avant'
    },
    items: [
      {
        productId: 'TD-R01',
        name: 'Chevalière Royale Atlas Onyx Noir',
        variant: 'Or Brossé & Onyx Noir / Taille 60',
        price: 269,
        quantity: 1,
        image: 'ring_onyx.jpg'
      }
    ],
    subtotal: 269,
    deliveryFee: 35,
    discount: 0,
    total: 304,
    paymentMethod: 'cod',
    status: 'pending_confirmation',
    statusLabel: 'En attente de confirmation WhatsApp / Téléphone',
    carrier: 'Amana Tanger',
    timeline: [
      { status: 'received', title: 'Commande Reçue sur le site', date: '19 Sept 16:50', current: true },
      { status: 'confirmed', title: 'En attente de votre confirmation téléphonique', date: 'Sous 1h', completed: false },
      { status: 'processing', title: 'Préparation en atelier', date: 'À venir', completed: false },
      { status: 'shipped', title: 'Expédition Tanger Express', date: 'À venir', completed: false },
      { status: 'out_for_delivery', title: 'Distribution Tanger', date: 'À venir', completed: false },
      { status: 'delivered', title: 'Livraison & Paiement espèces', date: 'À venir', completed: false }
    ]
  }
];
