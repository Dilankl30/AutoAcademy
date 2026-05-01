import { X, Search, Upload, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface AdminPanelProps {
  onClose: () => void;
}

interface Course {
  id: number;
  title: string;
  description?: string;
  package_requirement: string;
  type: string;
  idrive_link?: string;
  image_color: string;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLink, setEditLink] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    package_requirement: 'Básico',
    type: 'book',
    idrive_link: '',
    image_color: 'bg-blue-600',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      await api.createCourse(newCourse);
      setShowAddForm(false);
      setNewCourse({
        title: '',
        description: '',
        package_requirement: 'Básico',
        type: 'book',
        idrive_link: '',
        image_color: 'bg-blue-600',
      });
      await loadCourses();
      alert('Curso creado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al crear curso');
    }
  };

  const handleEdit = (id: number, currentLink?: string) => {
    setEditingId(id);
    setEditLink(currentLink || '');
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await api.updateCourse(id, { idrive_link: editLink });
      setEditingId(null);
      setEditLink('');
      await loadCourses();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar curso');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      try {
        await api.deleteCourse(id);
        await loadCourses();
        alert('Curso eliminado');
      } catch (error: any) {
        alert(error.message || 'Error al eliminar curso');
      }
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-6xl w-full mx-4 my-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold mb-6">Panel de Administrador</h3>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cursos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          {showAddForm ? 'Cancelar' : 'Agregar nuevo curso'}
        </button>

        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold mb-4">Nuevo Curso</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre del curso"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20"
                  placeholder="Descripción breve"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Paquete Requerido</label>
                <select
                  value={newCourse.package_requirement}
                  onChange={(e) => setNewCourse({ ...newCourse, package_requirement: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Básico">Básico</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Completo">Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="book">Libro/PDF</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link IDrive</label>
                <input
                  type="text"
                  value={newCourse.idrive_link}
                  onChange={(e) => setNewCourse({ ...newCourse, idrive_link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://idrive.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <select
                  value={newCourse.image_color}
                  onChange={(e) => setNewCourse({ ...newCourse, image_color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="bg-blue-600">Azul</option>
                  <option value="bg-purple-600">Morado</option>
                  <option value="bg-green-600">Verde</option>
                  <option value="bg-orange-600">Naranja</option>
                  <option value="bg-red-600">Rojo</option>
                  <option value="bg-indigo-600">Índigo</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddCourse}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear curso
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Portada</th>
                  <th className="text-left py-3 px-4">Título</th>
                  <th className="text-left py-3 px-4">Paquete</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Link IDrive</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className={`${course.image_color} w-12 h-12 rounded flex items-center justify-center text-white text-xs`}>
                        {course.type === 'book' ? 'PDF' : 'VID'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{course.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                        {course.package_requirement}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize">{course.type}</td>
                    <td className="py-3 px-4">
                      {editingId === course.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editLink}
                            onChange={(e) => setEditLink(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="https://idrive.com/..."
                          />
                          <button
                            onClick={() => handleSaveEdit(course.id)}
                            className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 truncate max-w-xs block">
                          {course.idrive_link || 'Sin link'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course.id, course.idrive_link)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Editar link"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
