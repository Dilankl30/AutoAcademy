import { BookOpen, Lock, Video, X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface Course {
  id: number;
  title: string;
  description?: string;
  package_requirement: string;
  type: string;
  image_color: string;
  idrive_link?: string;
}

interface CourseGridProps {
  selectedPackage: 'Básico' | 'Intermedio' | 'Completo' | null;
}

const PACKAGE_LEVEL: Record<'Básico' | 'Intermedio' | 'Completo', number> = {
  Básico: 1,
  Intermedio: 2,
  Completo: 3,
};

export default function CourseGrid({ selectedPackage }: CourseGridProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 dark:bg-slate-950">
        <h3 className="text-3xl font-bold mb-12 text-slate-900 dark:text-slate-100">Cursos y Materiales Recientemente Agregados</h3>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 dark:bg-slate-950">
      <h3 className="text-3xl font-bold mb-12 text-slate-900 dark:text-slate-100">Cursos y Materiales Recientemente Agregados</h3>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No hay cursos disponibles.</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const requiredLevel = PACKAGE_LEVEL[(course.package_requirement as keyof typeof PACKAGE_LEVEL) || 'Completo'] || 3;
            const userLevel = selectedPackage ? PACKAGE_LEVEL[selectedPackage] : 0;
            const hasAccess = userLevel >= requiredLevel;

            return (
            <div
              key={course.id}
              onClick={() => { if (hasAccess) setSelectedCourse(course); }}
              className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm transition-shadow overflow-hidden border dark:border-slate-800 ${hasAccess ? 'hover:shadow-md cursor-pointer' : 'opacity-80 cursor-not-allowed'}`}
            >
              <div className={`${course.image_color} h-48 flex items-center justify-center relative`}>
                {course.type === 'book' ? (
                  <BookOpen className="w-16 h-16 text-white" />
                ) : (
                  <Video className="w-16 h-16 text-white" />
                )}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                  {course.type === 'book' ? 'PDF' : 'Video'}
                </div>
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="flex items-center gap-2 text-white font-medium">
                      <Lock className="w-4 h-4" /> Requiere plan {course.package_requirement}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">{course.title}</h4>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                  Incluido en {course.package_requirement}
                </span>
              </div>
            </div>
            );
          })}
        </div>
      )}


      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">{selectedCourse.title}</h4>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Contenido tipo {selectedCourse.type === 'book' ? 'PDF' : 'Video'} · Plan requerido: {selectedCourse.package_requirement}</p>

            {selectedCourse.idrive_link ? (
              <div className="space-y-4">
                <a
                  href={selectedCourse.idrive_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4" /> Abrir enlace de Drive
                </a>

                <div className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-4">
                  <h5 className="font-semibold mb-2">¿Cómo usar el enlace?</h5>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700 dark:text-slate-200">
                    <li>Dale click al botón "Abrir enlace de Drive".</li>
                    <li>Inicia sesión en Google si te lo solicita.</li>
                    <li>Encontrarás el material del curso (PDF o video).</li>
                    <li>Descárgalo o míralo directamente desde Drive.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-lg p-4">
                Este curso aún no tiene enlace asignado. Contacta al administrador.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
