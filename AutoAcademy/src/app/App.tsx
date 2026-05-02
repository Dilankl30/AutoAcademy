import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandTicker from './components/BrandTicker';
import PricingCards from './components/PricingCards';
import CourseGrid from './components/CourseGrid';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'Básico' | 'Intermedio' | 'Completo' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const { user, loading, signIn, signUp, signOut, verifyEmailCode } = useAuth();

  const activePlan = user?.plan ?? selectedPackage;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSuccessMessage(customEvent.detail);
      setTimeout(() => setSuccessMessage(null), 3500);
    };

    window.addEventListener('app-success', onSuccess as EventListener);
    return () => window.removeEventListener('app-success', onSuccess as EventListener);
  }, []);

  const notifySuccess = (message: string) => {
    window.dispatchEvent(new CustomEvent('app-success', { detail: message }));
  };


  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      setAuthModal(null);
      notifySuccess('¡Inicio de sesión exitoso!');
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    try {
      await signUp(email, password, username);
      notifySuccess('¡Registro exitoso! Revisa tu correo para confirmar la cuenta.');
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
    <div className={`min-h-screen flex flex-col transition-colors ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <Header
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        isLoggedIn={!!user}
        isAdmin={user?.is_admin || false}
        onLogout={handleLogout}
        onAdminClick={() => setShowAdminPanel(true)}
        username={user?.username}
        plan={activePlan}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />

      <main className="flex-1">
        <BrandTicker />
        <Hero />
        <PricingCards selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
        <CourseGrid selectedPackage={activePlan} />
        <ContactForm />
      </main>

      <Footer />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchMode={(nextMode) => setAuthModal(nextMode)}
          onVerifyEmail={verifyEmailCode}
        />
      )}

      {successMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-800">
          ✅ {successMessage}
        </div>
      )}

      {showAdminPanel && user?.is_admin && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}