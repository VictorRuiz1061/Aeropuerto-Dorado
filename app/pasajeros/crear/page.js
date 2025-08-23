'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const initialState = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  vueloId: '',
  foto: '' // Se manejará por separado
};

export default function Page() {
  const [form, setForm] = useState(initialState);
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pasajeroId = searchParams.get('id');

  const apiRequest = async (url) => {
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
      return res.json();
  }

  useEffect(() => {
    const loadVuelos = async () => {
        try {
            const vuelosData = await apiRequest('/api/dorado/vuelos');
            setVuelos(vuelosData);
        } catch (err) {
            setError('Error cargando vuelos: ' + err.message);
        }
    };
    loadVuelos();

    if (pasajeroId) {
      setIsEditing(true);
      setLoading(true);
      const fetchPasajero = async () => {
        try {
          const data = await apiRequest(`/api/dorado/pasajeros/${pasajeroId}`);
          setForm(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPasajero();
    }
  }, [pasajeroId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/');

      const url = isEditing ? `/api/dorado/pasajeros/${pasajeroId}` : '/api/dorado/pasajeros';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Error al guardar');
      router.push('/pasajeros');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Editar' : 'Crear'} Pasajero</h1>
        <Link href="/pasajeros" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
          Volver
        </Link>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="nombre" placeholder="Nombre" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.nombre} onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.apellidos} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.email} onChange={handleChange} required />
          <input type="text" name="telefono" placeholder="Teléfono" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.telefono} onChange={handleChange} />
          <select name="vueloId" value={form.vueloId} onChange={handleChange} className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
            <option value="">Seleccione un Vuelo</option>
            {vuelos.map(v => <option key={v.id} value={v.id}>{v.codvuelo}</option>)}
          </select>
          {/* El campo de foto se puede añadir aquí si se necesita subir imagen */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}