import { Check, X, CreditCard, Landmark } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

const OWNER_WHATSAPP = '593989961041';

type PaymentMethod = 'card' | 'transfer';

export default function PricingCards({ selectedPackage, onSelectPackage }: PricingCardsProps) {
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [checkoutPlan, setCheckoutPlan] = useState<Package | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  useEffect(() => {
    loadPackages();

    const handlePlansUpdated = () => loadPackages();
    const handleVisibility = () => {
      if (!document.hidden) loadPackages();
    };

    const intervalId = window.setInterval(loadPackages, 15000);
    window.addEventListener('plans-updated', handlePlansUpdated);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('plans-updated', handlePlansUpdated);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const whatsappLink = useMemo(() => {
    if (!checkoutPlan) return '#';
    const message = `Hola, deseo adquirir el plan ${checkoutPlan.name} por $${checkoutPlan.price}/mes. Adjunto comprobante para validación.`;
    return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }, [checkoutPlan]);

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
    <>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">Paquetes más comprados</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.name;

            return (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-8 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isSelected ? 'border-blue-600 shadow-xl scale-[1.02]' : 'border-gray-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                {isSelected && (
                  <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Plan actual
                  </div>
                )}

                <h4 className="text-2xl font-bold mb-2">{pkg.name}</h4>
                <p className="text-gray-600 dark:text-slate-300 mb-4">{pkg.subtitle}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600">${pkg.price}</span>
                  <span className="text-gray-600 dark:text-slate-300">/mes</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex gap-2">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    onSelectPackage(pkg.name);
                    setCheckoutPlan(pkg);
                    setPaymentMethod('card');
                    window.dispatchEvent(new CustomEvent('app-success', { detail: `Plan ${pkg.name} seleccionado correctamente.` }));
                  }}
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

      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setCheckoutPlan(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-2xl font-bold mb-1">Proceder al pago</h4>
            <p className="text-gray-600 dark:text-slate-300 mb-4">Plan {checkoutPlan.name} - ${checkoutPlan.price}/mes</p>

            <div className="flex gap-3 mb-4">
              <button onClick={() => setPaymentMethod('card')} className={`px-4 py-2 rounded-lg border ${paymentMethod === 'card' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}><CreditCard className="w-4 h-4 inline mr-2" />Tarjeta</button>
              <button onClick={() => setPaymentMethod('transfer')} className={`px-4 py-2 rounded-lg border ${paymentMethod === 'transfer' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}><Landmark className="w-4 h-4 inline mr-2" />Transferencia</button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3">
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Nombre en la tarjeta" />
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Número de tarjeta" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="MM/AA" />
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="CVV" />
                </div>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Pagar con tarjeta</button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">Realiza la transferencia y envía tu comprobante por WhatsApp para validación manual.</p>
                <div className="bg-gray-50 border rounded-lg p-3 text-sm">
                  WhatsApp de verificación: <strong>0989961041</strong>
                </div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full text-center py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Enviar comprobante por WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
