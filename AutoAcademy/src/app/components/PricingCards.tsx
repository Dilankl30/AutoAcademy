import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

interface Package {
  id: number;
  name: 'Básico' | 'Intermedio' | 'Completo';
  subtitle: string;
  price: number;
  features: string[];
}

interface PricingCardsProps {
  selectedPackage: 'Básico' | 'Intermedio' | 'Completo' | null;
  onSelectPackage: (plan: 'Básico' | 'Intermedio' | 'Completo') => void;
}

const DEFAULT_PACKAGES: Package[] = [
  { id: 1, name: 'Básico', subtitle: 'Ideal para principiantes', price: 10, features: ['Acceso a 10 cursos esenciales', 'Material de apoyo descargable', 'Soporte por correo electrónico', 'Certificado al completar cada curso'] },
  { id: 2, name: 'Intermedio', subtitle: 'Para quienes buscan profundizar', price: 20, features: ['Todo lo del plan Básico', 'Acceso a cursos avanzados', 'Clases en vivo mensuales', 'Soporte prioritario', 'Evaluaciones personalizadas'] },
  { id: 3, name: 'Completo', subtitle: 'Conviértete en un experto', price: 30, features: ['Todo lo del plan Intermedio', 'Acceso a todos los cursos y novedades', 'Mentorías 1 a 1 mensuales', 'Comunidad privada exclusiva', 'Recursos premium descargables', 'Certificación profesional final'] },
];

export default function PricingCards({ selectedPackage, onSelectPackage }: PricingCardsProps) {
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    loadPackages();

    const handlePlansUpdated = () => loadPackages();
    window.addEventListener('plans-updated', handlePlansUpdated);

    return () => {
      window.removeEventListener('plans-updated', handlePlansUpdated);
    };
  }, []);

  const loadPackages = async () => {
    try {
      const data = await api.getPackages();
      if (!Array.isArray(data) || data.length === 0) return;

      const normalized = data.map((pkg: any, index: number) => ({
        id: Number(pkg.id ?? index + 1),
        name: (pkg.name ?? pkg.title ?? DEFAULT_PACKAGES[index]?.name ?? 'Básico') as Package['name'],
        subtitle: pkg.subtitle ?? pkg.description ?? DEFAULT_PACKAGES[index]?.subtitle ?? '',
        price: Number(pkg.price ?? pkg.monthly_price ?? DEFAULT_PACKAGES[index]?.price ?? 0),
        features: Array.isArray(pkg.features)
          ? pkg.features
          : typeof pkg.features === 'string'
            ? pkg.features.split('\n').filter(Boolean)
            : Array.isArray(pkg.benefits)
              ? pkg.benefits
              : DEFAULT_PACKAGES[index]?.features ?? [],
      }));

      setPackages(normalized);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h3 className="text-3xl font-bold text-center mb-12">Paquetes más comprados</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.name;

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-xl border-2 p-8 ${
                isSelected ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-200'
              }`}
            >
              {isSelected && (
                <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  Plan actual
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
                onClick={() => onSelectPackage(pkg.name)}
                className={`w-full py-3 rounded-lg font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isSelected ? 'Plan seleccionado' : 'Seleccionar plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
