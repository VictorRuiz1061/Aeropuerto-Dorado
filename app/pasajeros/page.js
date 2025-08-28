'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const [pasajeros, setPasajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Moved fetchPasajeros before handleDelete to ensure it's defined
  const fetchPasajeros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const res = await fetch("/api/dorado/pasajeros", {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Error en la solicitud");
      }
      const data = await res.json();
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
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const res = await fetch(`/api/dorado/pasajeros/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Error al eliminar");
      }
      fetchPasajeros(); // Refresh the list
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
        <div className="p-4 text-center text-red-500 bg-red-100 rounded-md">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pasajeros.map((pasajero) => (
            <div key={pasajero.id} className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="relative">
                    <img className="object-cover w-full h-48" src={pasajero.foto || 'https://via.placeholder.com/400x300'} alt={`Foto de ${pasajero.nombre}`} />
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{pasajero.nombre} {pasajero.apellidos}</h2>
                        <div className="flex space-x-1">
                        <button onClick={() => router.push(`/pasajeros/crear?id=${pasajero.id}`)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            ✏️
                        </button>
                        <button onClick={() => handleDelete(pasajero.id)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            🗑️
                        </button>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p className="truncate">{pasajero.email}</p>
                        <p>{pasajero.telefono}</p>
                        <p>Vuelo: {pasajero.vuelo?.codvuelo || 'N/A'}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
