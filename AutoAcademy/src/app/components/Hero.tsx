import { Star, Play, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
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
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-blue-50 font-medium">
              <Play className="w-5 h-5" />
              Ver vista previa
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 font-medium">
              <BookOpen className="w-5 h-5" />
              Más información
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
