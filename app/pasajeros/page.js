'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const [pasajeros, setPasajeros] = useState([]);
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

  const fetchPasajeros = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/dorado/pasajeros");
      setPasajeros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este pasajero?")) return;
    try {
      await apiRequest(`/api/pasajeros/${id}`, { method: "DELETE" });
      fetchPasajeros();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  useEffect(() => {
    fetchPasajeros();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administrar Pasajeros</h1>
        <Link href="/pasajeros/crear" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          + Adicionar Pasajero
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pasajeros.map((pasajero) => (
            <div key={pasajero.id} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{pasajero.nombre} {pasajero.apellidos}</h2>
                <div className="flex space-x-2">
                  <button onClick={() => router.push(`/pasajeros/crear?id=${pasajero.id}`)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(pasajero.id)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>{pasajero.email}</p>
                <p>{pasajero.telefono}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}