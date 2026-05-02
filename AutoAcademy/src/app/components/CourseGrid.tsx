import { BookOpen, Lock, Video } from 'lucide-react';
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
            <div key={course.id} className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm transition-shadow overflow-hidden border dark:border-slate-800 ${hasAccess ? 'hover:shadow-md' : 'opacity-80'}`}>
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
    </div>
  );
}
