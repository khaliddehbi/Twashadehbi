import watchGold from '../assets/images/watch_gold.jpg';
import watchLeather from '../assets/images/watch_leather.jpg';
import braceletCuff from '../assets/images/bracelet_cuff.jpg';
import braceletCuban from '../assets/images/bracelet_cuban.jpg';
import jewelryWomen from '../assets/images/jewelry_women.jpg';
import ringOnyx from '../assets/images/ring_onyx.jpg';
import ringEmerald from '../assets/images/ring_emerald.jpg';
import giftBox from '../assets/images/gift_box.jpg';

export const CATEGORIES = [
  { id: 'all', name: 'Tous les Produits', nameAr: 'جميع المنتجات', nameEn: 'All Products', count: 8 },
  { id: 'watches', name: 'Montres', nameAr: 'ساعات فاخرة', nameEn: 'Watches', count: 2, image: watchGold },
  { id: 'bracelets', name: 'Bracelets', nameAr: 'أساور ودمالج', nameEn: 'Bracelets', count: 3, image: braceletCuff },
  { id: 'rings', name: 'Bagues', nameAr: 'خواتم ملكية', nameEn: 'Rings', count: 2, image: ringOnyx },
  { id: 'sets', name: 'Coffrets Cadeaux', nameAr: 'علب هدايا فاخرة', nameEn: 'Gift Sets', count: 1, image: giftBox },
  { id: 'men', name: 'Accessoires Homme', nameAr: 'إكسسوارات رجالية', nameEn: "Men's Accessories", count: 4, image: ringOnyx },
  { id: 'women', name: 'Accessoires Femme', nameAr: 'إكسسوارات نسائية', nameEn: "Women's Accessories", count: 4, image: jewelryWomen },
];

export const PRODUCTS = [
  {
    id: 'TD-W01',
    name: 'Montre Royale Saphir Or 18K',
    nameAr: 'ساعة ملكية ذهبية ياقوتية 18 قيراط',
    nameEn: 'Royal Sapphire Chronograph 18K Gold',
    slug: 'montre-royale-saphir-or-18k',
    category: 'watches',
    gender: 'men',
    price: 499,
    originalPrice: 799,
    discountPercent: 38,
    rating: 4.9,
    reviewsCount: 47,
    stock: 6,
    isBestSeller: true,
    isNewArrival: false,
    isFlashSale: true,
    image: watchGold,
    gallery: [watchGold, watchLeather, giftBox],
    shortDescription: 'Chronographe d’exception avec cadran vert émeraude soleillé et finitions en or 18k.',
    shortDescriptionAr: 'كرونوغراف استثنائي بمينا أخضر زمردي ولمسات ذهبية 18 قيراط مقاومة للماء.',
    description: 'Chef-d’œuvre de l’horlogerie moderne inspiré du raffinement marocain. Dotée d’un boîtier en acier inoxydable 316L avec placage PVD or jaune 18K inaltérable, d’un cadran vert émeraude soleillé emblématique et d’un verre saphir inrayable. Livrée dans son écrin de luxe TWASHA DEHBI avec certificat d’authenticité et garantie 1 an.',
    descriptionAr: 'تحفة فنية في صناعة الساعات الراقية مستوحاة من الأناقة المغربية العصرية. هيكل فولاذي 316L مطلي بطبقة الذهب عيار 18 المقاوم لتغير اللون مع زجاج الياقوت المضاد للخدش.',
    specs: {
      'Matériau': 'Acier Inoxydable 316L & Placage Or 18K PVD',
      'Cadran': 'Vert Émeraude Soleillé avec guichet date',
      'Mouvement': 'Quartz Haute Précision Chronographe',
      'Verre': 'Saphir Inrayable traité antireflet',
      'Étanchéité': '5 ATM / 50 Mètres (Résiste à l’eau)',
      'Diamètre': '41 mm',
      'Garantie': 'Garantie Or 1 An incluse'
    },
    variants: [
      { id: 'gold-green', name: 'Or Jaune & Vert Émeraude', nameAr: 'ذهب أصفر ومينا أخضر', colorHex: '#D4AF37' },
      { id: 'gold-black', name: 'Or Jaune & Noir Intense', nameAr: 'ذهب أصفر ومينا أسود', colorHex: '#1A1A1A' }
    ],
    sizes: ['Taille Unique Ajustable (Outil de réglage offert)'],
    badge: 'Best-Seller'
  },
  {
    id: 'TD-W02',
    name: 'Montre Héritage Cuir & Or Minimaliste',
    nameAr: 'ساعة التراث بجلد بني أصلي وإطار ذهبي',
    nameEn: 'Heritage Leather & Gold Slim Timepiece',
    slug: 'montre-heritage-cuir-or',
    category: 'watches',
    gender: 'men',
    price: 389,
    originalPrice: 550,
    discountPercent: 29,
    rating: 4.8,
    reviewsCount: 32,
    stock: 9,
    isBestSeller: false,
    isNewArrival: true,
    isFlashSale: false,
    image: watchLeather,
    gallery: [watchLeather, watchGold],
    shortDescription: 'Boîtier extra-plat finition or 18k et bracelet en cuir véritable gaufré crocodile.',
    shortDescriptionAr: 'ساعة كلاسيكية أنيقة فائقة النحافة بإطار ذهبي وحزام جلد طبيعي فاخر.',
    description: 'La sobriété à son apogée. Boîtier ultra-plat de 7 mm en or poli, cadran blanc ivoire épuré et bracelet en cuir marocain véritable travaillé selon les traditions d’excellence.',
    descriptionAr: 'الأناقة الكلاسيكية الخالصة. إطار فائق النحافة بسماكة 7 مم مطلي ببريق الذهب مع حزام جلدي فاخر.',
    specs: {
      'Matériau': 'Boîtier Acier Inox 316L plaqué Or 18K',
      'Bracelet': 'Cuir Véritable surpiqué marron havane',
      'Épaisseur': '7 mm (Profil ultra-plat)',
      'Mouvement': 'Miyota Quartz Japonais Calibre Slim',
      'Verre': 'Minéral trempé résistant aux chocs',
      'Garantie': '1 An'
    },
    variants: [
      { id: 'brown-gold', name: 'Cuir Marron & Or', nameAr: 'جلد بني وذهب', colorHex: '#6E3C1B' },
      { id: 'black-gold', name: 'Cuir Noir & Or', nameAr: 'جلد أسود وذهب', colorHex: '#1F1F1F' }
    ],
    sizes: ['Bracelet Ajustable Standard (16 - 22 cm)'],
    badge: 'Nouveau'
  },
  {
    id: 'TD-B01',
    name: 'Bracelet Jonc Zahra Ciselé Or 18K',
    nameAr: 'سوار زهرة المحفور بالذهب الخالص 18 قيراط',
    nameEn: 'Zahra Engraved Cuff Bangle 18K Gold',
    slug: 'bracelet-jonc-zahra-cisele-or-18k',
    category: 'bracelets',
    gender: 'women',
    price: 279,
    originalPrice: 420,
    discountPercent: 34,
    rating: 5.0,
    reviewsCount: 89,
    stock: 4,
    isBestSeller: true,
    isNewArrival: false,
    isFlashSale: true,
    image: braceletCuff,
    gallery: [braceletCuff, giftBox],
    shortDescription: 'Gravures architecturales ciselées à la main avec poinçon de marque TWASHA DEHBI.',
    shortDescriptionAr: 'سوار عصري محفور بزخارف معمارية مغربية راقية بلمعان الذهب.',
    description: 'Une pièce maîtresse signée TWASHA DEHBI. Le jonc Zahra fusionne les lignes de l’architecture arabo-andalouse avec la pureté du bijou moderne. Résistant à l’eau, aux parfums et à la transpiration.',
    descriptionAr: 'قطعة فنية تجسد الزخرفة المعمارية المغربية بروح معاصرة. مقاومة للماء والعطور ولا يتغير لونها أبدًا.',
    specs: {
      'Matériau': 'Acier Titane Haute Densité + Triple placage Or 18K',
      'Finition': 'Ciselure Haute Précision laser',
      'Fermoir': 'Ouverture facile à ressort invisible',
      'Hypoallergénique': '100% sans nickel ni plomb',
      'Poids': '34 g'
    },
    variants: [
      { id: 'gold-18k', name: 'Or Jaune 18K', nameAr: 'ذهب أصفر 18 قيراط', colorHex: '#D4AF37' },
      { id: 'rose-gold', name: 'Or Rose Impérial', nameAr: 'ذهب وردي', colorHex: '#E0A899' },
      { id: 'silver-rhodium', name: 'Argent Rhodié', nameAr: 'فضة بلاتين', colorHex: '#D1D5DB' }
    ],
    sizes: ['S (Poignet fin 14-16 cm)', 'M (Poignet standard 16-18 cm)', 'L (Poignet fort 18-20 cm)'],
    badge: 'Best-Seller'
  },
  {
    id: 'TD-B02',
    name: 'Bracelet Maillons Cuban Casablanca',
    nameAr: 'سوار مايون كولكشن كازابلانكا الذهبي',
    nameEn: 'Casablanca Miami Cuban Link Bracelet',
    slug: 'bracelet-maillons-cuban-casablanca',
    category: 'bracelets',
    gender: 'men',
    price: 319,
    originalPrice: 480,
    discountPercent: 33,
    rating: 4.9,
    reviewsCount: 54,
    stock: 7,
    isBestSeller: true,
    isNewArrival: false,
    isFlashSale: false,
    image: braceletCuban,
    gallery: [braceletCuban, ringOnyx],
    shortDescription: 'Maillons serrés ultra-brillants avec fermoir boîte sécurisé gravé TWASHA DEHBI.',
    shortDescriptionAr: 'سوار رجالي كلاسيكي عريض بحلقات مصمتة وقفل فاخر محفور بعلامة طواشة ذهبي.',
    description: 'Un classique masculin audacieux. Finition miroir étincelante, fermoir luxe à double loquet de sécurité et présence royale au poignet.',
    descriptionAr: 'كلاسيكية رجالية متميزة بحلقات مصقولة بلمعان المرايا وقفل مزدوج الأمان.',
    specs: {
      'Largeur': '12 mm',
      'Longueur': '20 cm / 22 cm',
      'Matériau': 'Acier Inoxydable qualité chirurgicale 316L',
      'Placage': 'Or PVD 18K sous vide (Tenue 2+ ans)',
      'Poids': '68 g'
    },
    variants: [
      { id: 'gold-cuban', name: 'Or 18K Brillant', nameAr: 'ذهب عيار 18 لامع', colorHex: '#D4AF37' }
    ],
    sizes: ['20 cm (Standard)', '22 cm (Confort)'],
    badge: 'Tendance'
  },
  {
    id: 'TD-B03',
    name: 'Bracelet Trèfle Alhambra Nacre & Or',
    nameAr: 'سوار ألهامبرا الفاخر بعرق اللؤلؤ والذهب',
    nameEn: 'Alhambra Mother of Pearl Charm Bracelet',
    slug: 'bracelet-trefle-alhambra-nacre-or',
    category: 'bracelets',
    gender: 'women',
    price: 249,
    originalPrice: 380,
    discountPercent: 34,
    rating: 4.9,
    reviewsCount: 63,
    stock: 8,
    isBestSeller: false,
    isNewArrival: true,
    isFlashSale: true,
    image: jewelryWomen,
    gallery: [jewelryWomen, braceletCuff],
    shortDescription: '5 motifs trèfle porte-bonheur en nacre blanche naturelle et monture perlée or 18k.',
    shortDescriptionAr: 'سوار أيقوني بخمس حبات نادرة من عرق اللؤلؤ الطبيعي محاطة بحبيبات الذهب.',
    description: 'Icône de la haute joaillerie. Les motifs quadrilobés en nacre naturelle scintillent délicatement à la lumière. Chaîne ajustable avec fermoir mousqueton gravé.',
    descriptionAr: 'رمز الحظ والأناقة الرفيعة. قطع عرق اللؤلؤ الطبيعي ذات الانعكاسات الحريرية على سلسلة ذهبية ناعمة.',
    specs: {
      'Pierres': 'Nacre Blanche Naturelle irisée',
      'Monture': 'Plaqué Or 18 Carats 3 microns',
      'Longueur': '18 cm ajustable (chaînette + 3 cm)',
      'Hypoallergénique': 'Oui, testé dermatologiquement'
    },
    variants: [
      { id: 'pearl-gold', name: 'Nacre Blanche & Or', nameAr: 'عرق لؤلؤ أبيض وذهب', colorHex: '#F5F5F5' },
      { id: 'onyx-gold', name: 'Onyx Noir & Or', nameAr: 'أونيكس أسود وذهب', colorHex: '#1A1A1A' }
    ],
    sizes: ['Ajustable (16 à 21 cm)'],
    badge: 'Coup de Cœur'
  },
  {
    id: 'TD-R01',
    name: 'Chevalière Royale Atlas Onyx Noir',
    nameAr: 'خاتم الأطلس الملكي بحجر العقيق الأسود الطبيعي',
    nameEn: 'Atlas Royal Signet Ring with Natural Onyx',
    slug: 'chevaliere-royale-atlas-onyx-noir',
    category: 'rings',
    gender: 'men',
    price: 269,
    originalPrice: 390,
    discountPercent: 31,
    rating: 4.8,
    reviewsCount: 41,
    stock: 5,
    isBestSeller: true,
    isNewArrival: false,
    isFlashSale: false,
    image: ringOnyx,
    gallery: [ringOnyx, braceletCuban],
    shortDescription: 'Or brossé satiné 18k orné d’un onyx noir naturel taillé sur mesure.',
    shortDescriptionAr: 'خاتم رجالي فخم من الذهب المطفي بنقش أطلسي وحجر الأونيكس الطبيعي المصقول.',
    description: 'Inspirée de la force et de la majesté des montagnes de l’Atlas marocain. Le contraste saisissant entre l’or jaune brossé et la profondeur de l’onyx noir confère un charisme incomparable.',
    descriptionAr: 'مستوحى من شموخ جبال الأطلس المغربية. التباين الساحر بين الذهب الأصفر المطفي وعمق العقيق الأسود يمنحك هيبة لا تضاهى.',
    specs: {
      'Matériau': 'Acier 316L brossé + Placage Or 18K 5 couches',
      'Pierre': 'Véritable Onyx Noir naturel poli',
      'Bordure': 'Gravure tressée arabo-berbère',
      'Gravure intérieure': 'TWASHA DEHBI 18K'
    },
    variants: [
      { id: 'gold-onyx', name: 'Or Brossé & Onyx Noir', nameAr: 'ذهب مطفي وعقيق أسود', colorHex: '#D4AF37' }
    ],
    sizes: ['58 (Tour 18.5 mm)', '60 (Tour 19.1 mm)', '62 (Tour 19.7 mm)', '64 (Tour 20.3 mm)'],
    badge: 'Best-Seller'
  },
  {
    id: 'TD-R02',
    name: 'Bague Solitaire Émeraude Impériale',
    nameAr: 'خاتم زمردي إمبراطوري مرصع بأحجار متلألئة',
    nameEn: 'Imperial Emerald Solitaire Ring 18K Gold',
    slug: 'bague-solitaire-emeraude-imperiale',
    category: 'rings',
    gender: 'women',
    price: 299,
    originalPrice: 450,
    discountPercent: 33,
    rating: 4.9,
    reviewsCount: 38,
    stock: 3,
    isBestSeller: false,
    isNewArrival: true,
    isFlashSale: true,
    image: ringEmerald,
    gallery: [ringEmerald, jewelryWomen],
    shortDescription: 'Pierre centrale taille émeraude vert profond flanquée de diamants baguettes scintillants.',
    shortDescriptionAr: 'خاتم سهرة ساحر بحجر زمردي مركزي مستطيل وأحجار جانبية براقة على طوق مذهب.',
    description: 'Une splendeur digne des plus grands palais. La nuance vert émeraude intense rappelle les célèbres jardins Majorelle de Marrakech. Monture ouvragée en or 18k avec micropavage éclatant.',
    descriptionAr: 'بريق ملكي يستحضر سحر حدائق ماجوريل بمراكش. حجر زمردي مشع محاط بصفوة من الأحجار اللامعة.',
    specs: {
      'Pierre Centrale': 'Cristal Saphir Vert Émeraude taille émeraude (8x10 mm)',
      'Pierres Latérales': 'Zircons cubiques AAA taille baguette et brillants',
      'Métal': 'Argent 925 doré à l’Or fin 18K (Vermeil)',
      'Poinçon': 'S925 & TD'
    },
    variants: [
      { id: 'emerald-gold', name: 'Émeraude & Or Jaune', nameAr: 'زمرد وذهب أصفر', colorHex: '#1B4D3E' }
    ],
    sizes: ['52 (5.2 cm)', '54 (5.4 cm)', '56 (5.6 cm)', '58 (5.8 cm)'],
    badge: 'Édition Limitée'
  },
  {
    id: 'TD-S01',
    name: 'Coffret Majestueux Twasha (Montre + Jonc Ciselé)',
    nameAr: 'علبة الهدايا الملكية طواشة (ساعة + سوار محفور)',
    nameEn: 'Majestic Twasha Gift Set (Watch + Engraved Cuff)',
    slug: 'coffret-majestueux-twasha-duo',
    category: 'sets',
    gender: 'men',
    price: 699,
    originalPrice: 1100,
    discountPercent: 36,
    rating: 5.0,
    reviewsCount: 76,
    stock: 5,
    isBestSeller: true,
    isNewArrival: false,
    isFlashSale: true,
    image: giftBox,
    gallery: [giftBox, watchGold, braceletCuff],
    shortDescription: 'L’ensemble signature TWASHA DEHBI dans son luxueux écrin en velours noir et or.',
    shortDescriptionAr: 'طقم الهدايا الأيقوني الكامل في علبة مخملية سوداء فاخرة بختم ذهبي.',
    description: 'Le cadeau par excellence pour célébrer un anniversaire, une réussite ou un mariage marocain. Comprend la Montre Royale Saphir or ainsi que le Jonc Zahra assorti, protégés dans un coffret rigide en velours noir stamped or avec ruban satiné.',
    descriptionAr: 'الهدية المثالية لأغلى المناسبات والأعياد. يجمع بين الساعة الياقوتية الفخمة والسوار الذهبي المحفور داخل علبة مخملية ملكية.',
    specs: {
      'Contenu': '1x Montre Royale + 1x Jonc Ciselé Or 18K + Outil de réglage',
      'Packaging': 'Écrin rigide velours noir doublé satin or avec sceau armoiries',
      'Accessoires': 'Certificat de garantie 1 an + Sac cadeau Twasha Dehbi',
      'Idéal': 'Cadeau de mariage, Fêtes, Anniversaires'
    },
    variants: [
      { id: 'duo-black-gold', name: 'Coffret Velours Noir & Or', nameAr: 'طقم مخملي أسود وذهب', colorHex: '#0C0D0E' }
    ],
    sizes: ['Taille Universelle Ajustable'],
    badge: 'Cadeau Parfait'
  }
];
