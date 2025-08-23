'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const initialState = {
  salabordaje: '',
  horasalida: '',
  horallegada: '',
  codvuelo: '',
  destinoId: '',
  aerolineaId: ''
};

export default function Page() {
  const [form, setForm] = useState(initialState);
  const [destinos, setDestinos] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const vueloId = searchParams.get('id');

  const apiRequest = async (url) => {
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
      return res.json();
  }

  useEffect(() => {
    const loadRelatedData = async () => {
        try {
            const [destinosData, aerolineasData] = await Promise.all([
                apiRequest('/api/dorado/destinos'),
                apiRequest('/api/dorado/aerolineas')
            ]);
            setDestinos(destinosData);
            setAerolineas(aerolineasData);
        } catch (err) {
            setError('Error cargando datos relacionados: ' + err.message);
        }
    };
    loadRelatedData();

    if (vueloId) {
      setIsEditing(true);
      setLoading(true);
      const fetchVuelo = async () => {
        try {
          const data = await apiRequest(`/api/dorado/vuelos/${vueloId}`);
          // Format dates for datetime-local input
          data.horasalida = data.horasalida ? new Date(data.horasalida).toISOString().slice(0, 16) : '';
          data.horallegada = data.horallegada ? new Date(data.horallegada).toISOString().slice(0, 16) : '';
          setForm(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchVuelo();
    }
  }, [vueloId]);

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

      const url = isEditing ? `/api/dorado/vuelos/${vueloId}` : '/api/dorado/vuelos';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Error al guardar');
      router.push('/vuelos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Editar' : 'Crear'} Vuelo</h1>
        <Link href="/vuelos" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
          Volver
        </Link>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="codvuelo" placeholder="Código de Vuelo" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.codvuelo} onChange={handleChange} required />
          <input type="text" name="salabordaje" placeholder="Sala de Abordaje" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.salabordaje} onChange={handleChange} required />
          <input type="datetime-local" name="horasalida" placeholder="Hora de Salida" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.horasalida} onChange={handleChange} required />
          <input type="datetime-local" name="horallegada" placeholder="Hora de Llegada" className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={form.horallegada} onChange={handleChange} required />
          
          

          <select name="destinoId" value={form.destinoId} onChange={handleChange} className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
            <option value="">Seleccione un Destino</option>
            {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
          </select>

          <select name="aerolineaId" value={form.aerolineaId} onChange={handleChange} className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
            <option value="">Seleccione una Aerolínea</option>
            {aerolineas.map(a => <option key={a.id} value={a.id}>{a.descripcion}</option>)}
          </select>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}