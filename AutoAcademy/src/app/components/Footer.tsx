export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xl font-bold mb-4">AutoAcademy</h5>
            <p className="text-gray-400">
              Aprende sobre motores eléctricos y sistemas automotrices con nuestros cursos profesionales.
            </p>
          </div>

          <div>
            <h6 className="font-bold mb-4">Recursos</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Cursos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Guías</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Videos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-4">Empresa</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Carreras</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-4">Legal</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Términos de uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 AutoAcademy. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
