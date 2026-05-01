import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Hero from './components/Hero';
import PricingCards from './components/PricingCards';
import CourseGrid from './components/CourseGrid';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user, loading, signIn, signUp, signOut } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      setAuthModal(null);
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await signUp(email, password);
    } catch (error: any) {
      alert(error.message || 'Error al registrarse');
      throw error;
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowAdminPanel(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        isLoggedIn={!!user}
        isAdmin={user?.is_admin || false}
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

      {showAdminPanel && user?.is_admin && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}