import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';

export default function SEOHead() {
  const { currentView, selectedProductId, products, language } = useStore();

  useEffect(() => {
    let title = 'TWISHIYAT™ | Montres & Bijoux d’Exception au Maroc — Paiement à la Livraison';
    let description = 'Boutique officielle TWISHIYAT au Maroc : Montres de précision, bracelets & bagues à l’éclat inaltérable. Livraison Express Gratuite 24h/48h & Paiement en espèces après vérification du colis.';
    let url = 'https://www.twishiyat.ma/';
    let productSchema = null;

    if (currentView === 'catalog') {
      title = 'Boutique & Collections | TWISHIYAT Maroc — Montres, Bracelets & Bagues';
      description = 'Explorez les créations TWISHIYAT : montres élégantes, joncs ciselés, chevalières et coffrets cadeaux avec livraison gratuite partout au Maroc.';
      url = 'https://www.twishiyat.ma/?view=catalog';
    } else if (currentView === 'product' && selectedProductId) {
      const prod = products.find((p) => p.id === selectedProductId) || products[0];
      if (prod) {
        const prodName = language === 'ar' ? prod.nameAr : prod.name;
        title = `${prodName} (${prod.price} DH) | TWISHIYAT™ Maroc`;
        description = `${prod.shortDescription || prod.name} — Prix : ${prod.price} DH. Livraison express gratuite partout au Maroc. Paiement en espèces après vérification de votre colis.`;
        url = `https://www.twishiyat.ma/?view=product&id=${prod.id}`;

        // Schema.org Product Rich Snippet
        productSchema = {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          'name': prod.name,
          'image': [prod.image],
          'description': prod.description || prod.shortDescription,
          'sku': prod.id,
          'brand': {
            '@type': 'Brand',
            'name': 'TWISHIYAT'
          },
          'offers': {
            '@type': 'Offer',
            'url': url,
            'priceCurrency': 'MAD',
            'price': prod.price,
            'priceValidUntil': '2026-12-31',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': 'https://schema.org/InStock',
            'seller': {
              '@type': 'Organization',
              'name': 'TWISHIYAT'
            }
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': prod.rating || '4.9',
            'reviewCount': prod.reviewsCount || '45'
          }
        };
      }
    } else if (currentView === 'tracking') {
      title = 'Suivi de Colis en Temps Réel | TWISHIYAT Maroc';
      description = 'Suivez l’acheminement de votre commande TWISHIYAT en temps réel par SMS et WhatsApp partout au Maroc.';
      url = 'https://www.twishiyat.ma/?view=tracking';
    } else if (currentView === 'account') {
      title = 'Mon Espace Client | TWISHIYAT Maroc';
      description = 'Consultez l’historique de vos commandes, vos favoris et vos informations de livraison sécurisées chez TWISHIYAT.';
      url = 'https://www.twishiyat.ma/?view=account';
    }

    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', url);

    // Dynamic Product JSON-LD insertion/update
    const existingScript = document.getElementById('dynamic-product-jsonld');
    if (existingScript) existingScript.remove();

    if (productSchema) {
      const script = document.createElement('script');
      script.id = 'dynamic-product-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(productSchema);
      document.head.appendChild(script);
    }
  }, [currentView, selectedProductId, products, language]);

  return null; // Headless component
}
