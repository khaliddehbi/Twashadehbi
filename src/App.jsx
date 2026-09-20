import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import QuickViewModal from './components/catalog/QuickViewModal';
import SearchModal from './components/common/SearchModal';
import WhatsAppWidget from './components/common/WhatsAppWidget';
import PixelTrackerHUD from './components/common/PixelTrackerHUD';
import SocialProofPopup from './components/common/SocialProofPopup';
import ToastContainer from './components/common/ToastContainer';

// Views
import HomeView from './components/home/HomeView';
import CatalogView from './components/catalog/CatalogView';
import ProductDetailView from './components/product/ProductDetailView';
import CheckoutView from './components/checkout/CheckoutView';
import OrderConfirmationView from './components/checkout/OrderConfirmationView';
import TrackingView from './components/tracking/TrackingView';
import AccountView from './components/account/AccountView';
import AdminView from './components/admin/AdminView';

function MainRouter() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'confirmation':
        return <OrderConfirmationView />;
      case 'tracking':
        return <TrackingView />;
      case 'account':
        return <AccountView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flexGrow: 1 }}>
        {renderView()}
      </main>

      <Footer />

      {/* Global Modals & Micro-Interactions */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <WhatsAppWidget />
      <PixelTrackerHUD />
      <SocialProofPopup />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <MainRouter />
      </AdminProvider>
    </StoreProvider>
  );
}
