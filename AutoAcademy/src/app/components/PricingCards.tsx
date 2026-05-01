import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface Package {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  features: string[];
  is_highlighted: boolean;
}

export default function PricingCards() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await api.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Paquetes más comprados</h3>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h3 className="text-3xl font-bold text-center mb-12">Paquetes más comprados</h3>

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-xl border-2 p-8 ${
              pkg.is_highlighted ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-200'
            }`}
          >
            {pkg.is_highlighted && (
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
                pkg.is_highlighted
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
