import { BookOpen, Video } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  package: string;
  type: 'book' | 'video';
  imageColor: string;
}

const courses: Course[] = [
  { id: 1, title: 'Fundamentos de Motores AC', package: 'Completo', type: 'book', imageColor: 'bg-blue-600' },
  { id: 2, title: 'Diagnóstico Avanzado', package: 'Completo', type: 'video', imageColor: 'bg-purple-600' },
  { id: 3, title: 'Mantenimiento Preventivo', package: 'Profesional', type: 'book', imageColor: 'bg-green-600' },
  { id: 4, title: 'Sistemas de Control', package: 'Completo', type: 'video', imageColor: 'bg-orange-600' },
  { id: 5, title: 'Motores DC y Servomotores', package: 'Completo', type: 'book', imageColor: 'bg-red-600' },
  { id: 6, title: 'Variadores de Frecuencia', package: 'Profesional', type: 'video', imageColor: 'bg-indigo-600' },
];

export default function CourseGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h3 className="text-3xl font-bold mb-12">Cursos y Materiales Recientemente Agregados</h3>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className={`${course.imageColor} h-48 flex items-center justify-center relative`}>
              {course.type === 'book' ? (
                <BookOpen className="w-16 h-16 text-white" />
              ) : (
                <Video className="w-16 h-16 text-white" />
              )}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                {course.type === 'book' ? 'PDF' : 'Video'}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-2">{course.title}</h4>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                Incluido en {course.package}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
