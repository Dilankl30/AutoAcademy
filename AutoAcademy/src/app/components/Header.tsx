import { Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onAdminClick: () => void;
  username?: string;
  plan?: 'Básico' | 'Intermedio' | 'Completo' | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ onLoginClick, onRegisterClick, isLoggedIn, isAdmin, onLogout, onAdminClick, username, plan, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">AutoAcademy</h1>
          <nav className="flex gap-6">
            <a href="#inicio" className={`${theme === "dark" ? "text-slate-200" : "text-gray-700"} hover:text-blue-600`}>Inicio</a>
            <a href="#explorar" className={`${theme === "dark" ? "text-slate-200" : "text-gray-700"} hover:text-blue-600`}>Explorar</a>
            <a href="#contactanos" className={`${theme === "dark" ? "text-slate-200" : "text-gray-700"} hover:text-blue-600`}>Contáctanos</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cursos..."
              className={`pl-10 pr-4 py-2 border rounded-lg w-64 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'border-gray-300'}`}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <button onClick={onToggleTheme} className={`p-2 rounded-lg border ${theme === 'dark' ? 'border-slate-700 text-yellow-300' : 'border-gray-300 text-gray-700'}`} title="Cambiar tema">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {username && <span className={`${theme === "dark" ? "text-slate-200" : "text-gray-700"} text-sm`}>Bienvenido, {username}</span>}
              <span className="text-sm text-blue-600 font-medium">{plan ? `Plan: ${plan}` : 'Adquirir plan'}</span>
              {isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Panel Admin
                </button>
              )}
              <button
                onClick={onLogout}
                className={`px-4 py-2 border border-blue-600 text-blue-600 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-blue-50"}`}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onLoginClick}
                className={`px-4 py-2 border border-blue-600 text-blue-600 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-blue-50"}`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
