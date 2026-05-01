import { Star, Play, BookOpen, X } from 'lucide-react';
import { useState } from 'react';
import previewImage from '../../imports/image.png';

const planBenefits = [
  {
    name: 'Plan Básico',
    benefits: ['Cursos esenciales', 'Material descargable', 'Soporte por correo'],
  },
  {
    name: 'Plan Intermedio',
    benefits: ['Cursos avanzados', 'Clases en vivo', 'Evaluaciones personalizadas'],
  },
  {
    name: 'Plan Completo',
    benefits: ['Acceso total', 'Mentorías 1 a 1', 'Recursos premium'],
  },
];

export default function Hero() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div id="inicio" className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Motores Eléctricos</h2>
          <p className="text-blue-100 mb-6">
            Aprende todo sobre motores eléctricos desde lo básico hasta aplicaciones avanzadas.
            Incluye guías de taller, casos prácticos y recursos descargables.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-blue-100">4.9 (234 valoraciones)</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-blue-50 font-medium"
            >
              <Play className="w-5 h-5" />
              Ver vista previa
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Más información
            </button>
          </div>
        </div>
      </div>
      <div id="explorar" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="max-w-3xl bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-3">¿Cómo usar AutoAcademy?</h3>
          <ol className="list-decimal pl-5 space-y-2 text-blue-100">
            <li>Regístrate e inicia sesión con tu cuenta.</li>
            <li>Selecciona el plan que mejor se adapte a tu nivel.</li>
            <li>Explora cursos y materiales según tu plan activo.</li>
            <li>Si tienes dudas, usa la sección de contacto al final de la página.</li>
          </ol>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-xl max-w-5xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6">Vista previa de contenido y beneficios</h3>

            <h4 className="text-lg font-semibold mb-3">Ejemplos de PDFs del curso</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg overflow-hidden bg-gray-50">
                  <img src={previewImage} alt={`Vista previa PDF ${item}`} className="w-full h-40 object-cover" />
                  <div className="p-3 text-sm text-gray-700">Guía PDF #{item} - muestra de contenido técnico</div>
                </div>
              ))}
            </div>

            <h4 className="text-lg font-semibold mb-3">Lo que obtienes al comprar cada plan</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {planBenefits.map((plan) => (
                <div key={plan.name} className="border rounded-lg p-4 bg-blue-50">
                  <h5 className="font-bold mb-2 text-blue-700">{plan.name}</h5>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
