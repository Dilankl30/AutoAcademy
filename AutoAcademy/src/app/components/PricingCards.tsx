import { Check } from 'lucide-react';

const packages = [
  {
    name: 'Básico',
    price: 10,
    subtitle: 'Acceso Limitado',
    features: [
      'Vistas previas limitadas',
      '5 archivos clave (links IDrive)',
      'Guías PDF básicas',
      'Acceso parcial al foro',
      'Soporte por email'
    ],
    highlighted: false
  },
  {
    name: 'Profesional',
    price: 20,
    subtitle: 'Acceso Ampliado',
    features: [
      '15 cursos completos',
      'Casos de estudio de taller',
      'Guías avanzadas en PDF',
      'Acceso completo al foro',
      'Soporte prioritario',
      'Actualizaciones mensuales'
    ],
    highlighted: false
  },
  {
    name: 'Completo',
    price: 30,
    subtitle: 'Guía de Taller Absoluta',
    features: [
      'Acceso ilimitado a todo el material',
      'Guía completa de taller',
      'Todos los videos y tutoriales',
      'Descargas prioritarias',
      'Certificado de finalización',
      'Soporte 24/7',
      'Acceso de por vida'
    ],
    highlighted: true
  }
];

export default function PricingCards() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h3 className="text-3xl font-bold text-center mb-12">Paquetes más comprados</h3>

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`bg-white rounded-xl border-2 p-8 ${
              pkg.highlighted ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-200'
            }`}
          >
            {pkg.highlighted && (
              <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Más popular
              </div>
            )}

            <h4 className="text-2xl font-bold mb-2">{pkg.name}</h4>
            <p className="text-gray-600 mb-4">{pkg.subtitle}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">${pkg.price}</span>
              <span className="text-gray-600">/mes</span>
            </div>

            <ul className="space-y-3 mb-8">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium ${
                pkg.highlighted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Seleccionar plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
