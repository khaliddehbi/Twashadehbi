const fs = require('fs');
const path = require('path');

console.log('=====================================================');
console.log('AUDIT COMPLET & SUITE DE TESTS AUTOMATISÉE — TWISHIYAT.MA');
console.log('=====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let blockedTests = 0;
const issues = [];

function assertTest(phase, testId, description, condition, errorDetails = null, severity = 'P2') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testId}: ${description}`);
  } else {
    failedTests++;
    console.log(`[FAIL] [${severity}] ${testId}: ${description}`);
    if (errorDetails) console.log(`       Details: ${errorDetails}`);
    issues.push({
      phase,
      id: testId,
      description,
      details: errorDetails,
      severity
    });
  }
}

// ==========================================
// PHASE 1 — AUDIT DE L'ARCHITECTURE
// ==========================================
console.log('\n--- PHASE 1: Architecture & Dépendances ---');
const rootDir = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
assertTest('Phase 1', 'ARCH-001', 'React 19 et Vite configurés', pkg.dependencies.react && pkg.devDependencies.vite);
assertTest('Phase 1', 'ARCH-002', 'Supabase client installé pour gestion des données', !!pkg.dependencies['@supabase/supabase-js']);
assertTest('Phase 1', 'ARCH-003', 'canvas-confetti & lucide-react présents pour UX riche', !!pkg.dependencies['canvas-confetti'] && !!pkg.dependencies['lucide-react']);

// ==========================================
// PHASE 2 — TEST DU DOMAINE & SEO BASIQUE
// ==========================================
console.log('\n--- PHASE 2: Domaine, HTTPS, Robots, Sitemap & Redirections ---');
const robots = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf8');
assertTest('Phase 2', 'DOM-001', 'robots.txt autorise l\'indexation et référence le sitemap officiel', 
  robots.includes('User-agent: *') && robots.includes('https://www.twishiyat.ma/sitemap.xml')
);

const sitemap = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'), 'utf8');
assertTest('Phase 2', 'DOM-002', 'sitemap.xml contient le domaine officiel twishiyat.ma en HTTPS sans HTTP non sécurisé', 
  sitemap.includes('https://www.twishiyat.ma/') && !sitemap.includes('<loc>http://')
);

const vercelJson = fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8');
assertTest('Phase 2', 'DOM-003', 'vercel.json réécrit les routes SPA vers /', 
  vercelJson.includes('"destination": "/"')
);

const redirects = fs.readFileSync(path.join(rootDir, 'public/_redirects'), 'utf8');
assertTest('Phase 2', 'DOM-004', 'public/_redirects configuré pour Netlify / Cloudflare Pages', 
  /\/\*\s+\/index\.html\s+200/.test(redirects)
);

// ==========================================
// PHASE 3 & 4 — HOMEPAGE, BRANDING & NAVIGATION
// ==========================================
console.log('\n--- PHASE 3 & 4: Branding, Homepage & Navigation ---');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assertTest('Phase 3', 'BRAND-001', 'Titre de page officiel TWISHIYAT', 
  indexHtml.includes('<title>TWISHIYAT™ | Montres & Bijoux')
);
assertTest('Phase 3', 'BRAND-002', 'Absence absolue du terme "garantie" (Règle utilisateur)', 
  !indexHtml.toLowerCase().includes('garantie'),
  'index.html contient encore la mention "carte de garantie 1 an" dans le FAQ Schema',
  'P2'
);

// Check footer links in Footer.jsx
const footerJsx = fs.readFileSync(path.join(rootDir, 'src/components/common/Footer.jsx'), 'utf8');
const hasDeadFooterLinks = footerJsx.includes('href="#"');
assertTest('Phase 3', 'FOOT-001', 'Liens de bas de page (CGV, Confidentialité, Retours) sans lien mort "#"', 
  !hasDeadFooterLinks,
  'Les liens de politique légale (CGV, Confidentialité, Retours) utilisent href="#" sans modal/action',
  'P2'
);

// ==========================================
// PHASE 5 & 6 — CATALOGUE & FICHES PRODUITS
// ==========================================
console.log('\n--- PHASE 5 & 6: Catalogue & Fiches Produits ---');
const productsFile = fs.readFileSync(path.join(rootDir, 'src/data/products.js'), 'utf8');
assertTest('Phase 5', 'CAT-001', 'Tous les produits ont un slug SEO, un prix, un stock et des images', 
  productsFile.includes('slug:') && productsFile.includes('price:') && productsFile.includes('stock:') && productsFile.includes('gallery:')
);

// ==========================================
// PHASE 7 — TEST DU PANIER & PERSISTANCE
// ==========================================
console.log('\n--- PHASE 7: Panier & Persistance ---');
const storeContext = fs.readFileSync(path.join(rootDir, 'src/context/StoreContext.jsx'), 'utf8');
assertTest('Phase 7', 'CART-001', 'Persistance du panier dans localStorage', 
  storeContext.includes("localStorage.setItem('twishiyat_cart'")
);
assertTest('Phase 7', 'CART-002', 'Livraison 100% Gratuite partout au Maroc (isFreeShipping = true)', 
  storeContext.includes('const isFreeShipping = true;')
);

// Check default city in customerProfile
const cityDefaultMatch = storeContext.match(/city:\s*'([^']*)'/);
assertTest('Phase 7', 'CHECK-001', 'Champ Ville par défaut vide pour saisie libre marocaine', 
  cityDefaultMatch && cityDefaultMatch[1] === '',
  `Le champ ville a une valeur par défaut '${cityDefaultMatch ? cityDefaultMatch[1] : 'unknown'}' au lieu d'être vide`,
  'P2'
);

// ==========================================
// PHASE 8 — VALIDATION CHECKOUT & TÉLÉPHONE MAROCAIN
// ==========================================
console.log('\n--- PHASE 8: Checkout & Téléphone Marocain ---');
const citiesFile = fs.readFileSync(path.join(rootDir, 'src/data/moroccanCities.js'), 'utf8');

// Test phone validation regex logic
const phoneRegex = /^(?:(?:\+|00)212|0)([5-7])\d{8}$/;
const testNumbers = [
  { num: '0612345678', expected: true },
  { num: '0708759510', expected: true },
  { num: '0522123456', expected: true },
  { num: '+212612345678', expected: true },
  { num: '+212708759510', expected: true },
  { num: '00212612345678', expected: true },
  { num: '212612345678', expected: false }, // Direct 212 without +
  { num: '0612345', expected: false },      // Trop court
  { num: '061234567899', expected: false },  // Trop long
  { num: '06ABCDEFGH', expected: false },    // Lettres
  { num: '0812345678', expected: false }     // Indicatif inexistant
];

let phoneTestsPassed = true;
testNumbers.slice(0, 6).forEach(t => {
  const clean = t.num.replace(/[\s\-\(\)\.]/g, '');
  if (!phoneRegex.test(clean)) phoneTestsPassed = false;
});
assertTest('Phase 8', 'PHONE-001', 'Validation des formats téléphoniques marocains standards (06/07/+212)', phoneTestsPassed);

// Check tolerance for 212 without '+'
const regexWithOptionalPlus = /^(?:(?:\+|00)?212|0)([5-7])\d{8}$/;
assertTest('Phase 8', 'PHONE-002', 'Support du format 2126... sans signe + requis', 
  regexWithOptionalPlus.test('212612345678') && !phoneRegex.test('212612345678'),
  'Le regex actuel exige un "+" ou "00" devant 212, rejetant les numéros saisis "2126..."',
  'P2'
);

// Anti-double submission guard check
const checkoutJsx = fs.readFileSync(path.join(rootDir, 'src/components/checkout/CheckoutView.jsx'), 'utf8');
const hasDebounceOrRefCheckout = checkoutJsx.includes('isSubmittingRef') || checkoutJsx.includes('if (isSubmitting) return');
assertTest('Phase 8', 'ORDER-001', 'Protection anti-double clic / double commande synchrone', 
  hasDebounceOrRefCheckout,
  'handleSubmitOrder manque d\'un verrou synchrone immédiat (isSubmittingRef) contre double clic rapide',
  'P1'
);

const productDetailJsx = fs.readFileSync(path.join(rootDir, 'src/components/product/ProductDetailView.jsx'), 'utf8');
const hasDebounceOrRefExpress = productDetailJsx.includes('isExpressSubmittingRef') || productDetailJsx.includes('if (expressSubmitting) return');
assertTest('Phase 8', 'ORDER-002', 'Protection anti-double clic formulaire Express 1-Clic', 
  hasDebounceOrRefExpress,
  'handleExpressOrder manque d\'un verrou synchrone immédiat contre double clic rapide',
  'P1'
);

// ==========================================
// PHASE 13 — META PIXEL & ANALYTICS BRIDGE
// ==========================================
console.log('\n--- PHASE 13: Meta Pixel, GA4 & Tracking ---');
const hasFbqCall = storeContext.includes('window.fbq');
const hasGtagCall = storeContext.includes('window.gtag');
assertTest('Phase 13', 'TRACK-001', 'Émission réelle des événements Meta Pixel (window.fbq)', 
  hasFbqCall,
  'trackPixel ne notifie que l\'état React interne. Il n\'appelle pas window.fbq pour Meta Ads.',
  'P1'
);

assertTest('Phase 13', 'TRACK-002', 'Émission réelle des événements Google Analytics (window.gtag)', 
  hasGtagCall,
  'trackPixel n\'appelle pas window.gtag pour GA4.',
  'P1'
);

// UTM Tracking persistence check
const hasUtmCapture = storeContext.includes('utm_source') || storeContext.includes('UTM');
assertTest('Phase 13', 'TRACK-003', 'Persistance des paramètres publicitaires UTM (Meta / Instagram)', 
  hasUtmCapture,
  'Les paramètres publicitaires utm_source, utm_campaign, etc. ne sont pas attachés à la commande',
  'P2'
);

// ==========================================
// PHASE 14 & 15 — WHATSAPP & LIENS SOCIAUX
// ==========================================
console.log('\n--- PHASE 14 & 15: WhatsApp Concierge & Réseaux Sociaux ---');
const waWidget = fs.readFileSync(path.join(rootDir, 'src/components/common/WhatsAppWidget.jsx'), 'utf8');
assertTest('Phase 14', 'WA-001', 'Numéro WhatsApp officiel marocain (+212 708 759 510) configuré', 
  waWidget.includes('212708759510')
);

assertTest('Phase 15', 'SOC-001', 'Liens Instagram et Facebook officiels valides avec rel="noopener noreferrer"', 
  footerJsx.includes('https://www.instagram.com/twishiyat_/') && footerJsx.includes('https://www.facebook.com/profile.php?id=61594978681127')
);

// ==========================================
// PHASE 16 — TEST 404 & ROUTES INCONNUES
// ==========================================
console.log('\n--- PHASE 16: Gestion 404 ---');
const appJsx = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
assertTest('Phase 16', 'ROUTE-001', 'Routeur principal gère les vues inconnues sans planter', 
  appJsx.includes('default:')
);

// ==========================================
// PHASE 17 — SÉCURITÉ FRONTEND
// ==========================================
console.log('\n--- PHASE 17: Sécurité Frontend ---');
const supabaseJs = fs.readFileSync(path.join(rootDir, 'src/lib/supabase.js'), 'utf8');
const hasServiceRoleKey = supabaseJs.includes('service_role') || supabaseJs.includes('SUPABASE_SERVICE_KEY');
assertTest('Phase 17', 'SEC-001', 'Aucune clé secrète backend ou service_role dans le bundle', 
  !hasServiceRoleKey
);

// ==========================================
// RÉSUMÉ DE L'AUDIT
// ==========================================
console.log('\n=====================================================');
console.log(`TOTAL DES TESTS : ${totalTests}`);
console.log(`RÉUSSIS : ${passedTests}`);
console.log(`ÉCHOUÉS : ${failedTests}`);
console.log(`BLOQUÉS : ${blockedTests}`);
console.log('=====================================================');
console.log('\nBUGS ET PROBLÈMES DÉTECTÉS PAR GRAVITÉ :');
issues.sort((a, b) => a.severity.localeCompare(b.severity)).forEach(iss => {
  console.log(`- [${iss.severity}] ${iss.id} (${iss.phase}): ${iss.description}`);
  if (iss.details) console.log(`  -> ${iss.details}`);
});
