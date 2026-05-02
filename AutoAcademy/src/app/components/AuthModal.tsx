import { X, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, username: string) => Promise<void>;
  onSwitchMode: (nextMode: 'login' | 'register') => void;
  onVerifyEmail: (email: string, code: string) => Promise<void>;
}

export default function AuthModal({ mode, onClose, onLogin, onRegister, onSwitchMode, onVerifyEmail }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      await onLogin(email, password);
    } else {
      if (password === confirmPassword) {
        try {
          await onRegister(email, password, username.trim());
          setShowConfirmation(true);
        } catch (error) {
          // Error already handled in parent
        }
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Confirma tu correo</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              Te enviamos un código de verificación a <strong>{email}</strong>.
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg mb-3"
              placeholder="Ingresa el código"
            />

            <button
              onClick={async () => {
                try {
                  setVerifying(true);
                  await onVerifyEmail(email, verificationCode.trim());
                  alert('Correo verificado correctamente. Ahora puedes iniciar sesión.');
                  onClose();
                } catch (error: any) {
                  alert(error.message || 'No se pudo verificar el correo');
                } finally {
                  setVerifying(false);
                }
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2"
              disabled={verifying || !verificationCode.trim()}
            >
              {verifying ? 'Verificando...' : 'Verificar código'}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-300 dark:border-slate-700 rounded-lg"
            >
              Verificar después
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold mb-6">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                  placeholder="tu_usuario"
                  minLength={3}
                  maxLength={30}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-slate-300 mt-4">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          {' '}
          <button
            onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
