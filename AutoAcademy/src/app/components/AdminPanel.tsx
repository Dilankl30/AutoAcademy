import { X, Search, Upload, Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface AdminPanelProps {
  onClose: () => void;
}

interface Course {
  id: number;
  title: string;
  package: string;
  type: string;
  link?: string;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'Fundamentos de Motores AC', package: 'Completo', type: 'PDF', link: 'idrive.com/abc123' },
    { id: 2, title: 'Diagnóstico Avanzado', package: 'Completo', type: 'Video', link: 'idrive.com/def456' },
    { id: 3, title: 'Mantenimiento Preventivo', package: 'Profesional', type: 'PDF', link: 'idrive.com/ghi789' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLink, setEditLink] = useState('');

  const handleUploadLink = (id: number) => {
    const link = prompt('Ingrese el link de IDrive:');
    if (link) {
      setCourses(courses.map(c => c.id === id ? { ...c, link } : c));
    }
  };

  const handleEdit = (id: number, currentLink?: string) => {
    setEditingId(id);
    setEditLink(currentLink || '');
  };

  const handleSaveEdit = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, link: editLink } : c));
    setEditingId(null);
    setEditLink('');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-5xl w-full mx-4 my-8 relative">
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

        <button className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Agregar nuevo curso
        </button>

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
                    <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                      {course.type}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{course.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                      {course.package}
                    </span>
                  </td>
                  <td className="py-3 px-4">{course.type}</td>
                  <td className="py-3 px-4">
                    {editingId === course.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editLink}
                          onChange={(e) => setEditLink(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="idrive.com/..."
                        />
                        <button
                          onClick={() => handleSaveEdit(course.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">
                        {course.link || 'Sin link'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {!course.link && (
                        <button
                          onClick={() => handleUploadLink(course.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Subir link"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(course.id, course.link)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="Editar"
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
      </div>
    </div>
  );
}
