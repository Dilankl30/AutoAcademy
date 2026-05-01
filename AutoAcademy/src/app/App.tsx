import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PricingCards from './components/PricingCards';
import CourseGrid from './components/CourseGrid';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const ADMIN_EMAIL = 'admin@autoacademy.com';

export default function App() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);

  const handleLogin = (email: string, password: string) => {
    const isAdmin = email === ADMIN_EMAIL;
    setUser({ email, isAdmin });
    setAuthModal(null);
  };

  const handleRegister = (email: string, password: string) => {
    console.log('User registered:', email);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        isLoggedIn={!!user}
        isAdmin={user?.isAdmin || false}
        onLogout={handleLogout}
        onAdminClick={() => setShowAdminPanel(true)}
      />

      <main className="flex-1">
        <Hero />
        <PricingCards />
        <CourseGrid />
        <ContactForm />
      </main>

      <Footer />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {showAdminPanel && user?.isAdmin && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}