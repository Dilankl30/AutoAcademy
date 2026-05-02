import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { api } from '../utils/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.submitContact(formData);
      alert('Mensaje enviado. Nos pondremos en contacto contigo pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      alert(error.message || 'Error al enviar el mensaje');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contactanos" className="bg-gray-50 dark:bg-slate-950 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">Contáctanos</h3>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Envíanos un mensaje</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Correo</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensaje</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg h-32"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Información de contacto</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600 dark:text-slate-300">contacto@autoacademy.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-gray-600 dark:text-slate-300">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-gray-600 dark:text-slate-300">123 Tech Street, Ciudad</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">Horario de atención</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">Lunes - Viernes: 9:00 AM - 6:00 PM</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">Sábado: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
