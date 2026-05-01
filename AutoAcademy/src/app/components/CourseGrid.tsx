import { BookOpen, Video } from 'lucide-react';
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

export default function CourseGrid() {
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
      <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
        <h3 className="text-3xl font-bold mb-12">Cursos y Materiales Recientemente Agregados</h3>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h3 className="text-3xl font-bold mb-12">Cursos y Materiales Recientemente Agregados</h3>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No hay cursos disponibles.</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className={`${course.image_color} h-48 flex items-center justify-center relative`}>
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
                  Incluido en {course.package_requirement}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
