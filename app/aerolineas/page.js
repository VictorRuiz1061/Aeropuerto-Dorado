'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const [aerolineas, setAerolineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      throw new Error("No autenticado");
    }
    const res = await fetch(url, {
      ...options,
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers },
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(errorBody || "Error en la solicitud");
    }
    return res.json();
  };

  const fetchAerolineas = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/dorado/aerolineas");
      setAerolineas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta aerolínea?")) return;
    try {
      await apiRequest(`/api/dorado/aerolineas/${id}`, { method: "DELETE" });
      fetchAerolineas();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  useEffect(() => {
    fetchAerolineas();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administrar Aerolíneas</h1>
        <Link href="/aerolineas/crear" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          + Adicionar Aerolínea
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aerolineas.map((aerolinea) => (
            <div key={aerolinea.id} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{aerolinea.descripcion}</h2>
                <div className="flex space-x-2">
                  <button onClick={() => router.push(`/aerolineas/crear?id=${aerolinea.id}`)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(aerolinea.id)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}