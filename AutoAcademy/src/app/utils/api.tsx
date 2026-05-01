import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a96c109b`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`;
};

export const api = {
  // Courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE}/courses`, {
      headers: {
        'Authorization': getAuthHeader(),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.courses;
  },

  createCourse: async (courseData: any) => {
    const response = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(courseData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.course;
  },

  updateCourse: async (id: number, courseData: any) => {
    const response = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(courseData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.course;
  },

  deleteCourse: async (id: number) => {
    const response = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getAuthHeader(),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Packages
  getPackages: async () => {
    const response = await fetch(`${API_BASE}/packages`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.packages;
  },



  updatePackage: async (id: number, packageData: any) => {
    const payload = {
      ...packageData,
      monthly_price: packageData.price,
      description: packageData.subtitle,
      benefits: packageData.features,
    };

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(payload),
      cache: 'no-store' as RequestCache,
    };

    let response = await fetch(`${API_BASE}/packages/${id}`, {
      method: 'PUT',
      ...requestOptions,
    });

    if (!response.ok) {
      response = await fetch(`${API_BASE}/packages/${id}`, {
        method: 'PATCH',
        ...requestOptions,
      });
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo actualizar el plan');
    return data.package || data;
  },

  // Contact
  submitContact: async (contactData: { name: string; email: string; message: string }) => {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(contactData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getContactMessages: async () => {
    const response = await fetch(`${API_BASE}/contact`, {
      headers: {
        'Authorization': getAuthHeader(),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.messages;
  },
};
