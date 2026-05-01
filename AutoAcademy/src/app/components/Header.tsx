import { Search } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onAdminClick: () => void;
  username?: string;
}

export default function Header({ onLoginClick, onRegisterClick, isLoggedIn, isAdmin, onLogout, onAdminClick, username }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">AutoAcademy</h1>
          <nav className="flex gap-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Inicio</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Explorar</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Recursos</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cursos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {username && <span className="text-sm text-gray-700">Hola, {username}</span>}
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
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onLoginClick}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
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
