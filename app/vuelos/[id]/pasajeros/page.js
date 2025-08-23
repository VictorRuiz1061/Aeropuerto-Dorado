'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const [vuelo, setVuelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchVuelo = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/dorado/vuelos/${id}`);
          if (!res.ok) {
            throw new Error('Error al obtener los datos del vuelo');
          }
          const data = await res.json();
          setVuelo(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchVuelo();
    }
  }, [id]);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/vuelos" className="text-indigo-600 hover:text-indigo-900">
            &larr; Volver a Vuelos
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : vuelo ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pasajeros del Vuelo {vuelo.codvuelo}</h1>
            {vuelo.pasajeros && vuelo.pasajeros.length > 0 ? (
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Teléfono
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vuelo.pasajeros.map((pasajero) => (
                        <tr key={pasajero.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{pasajero.nombre} {pasajero.apellidos}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{pasajero.email}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{pasajero.telefono}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No hay pasajeros para este vuelo.</p>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">No se encontró el vuelo.</div>
        )}
      </div>
    </div>
  );
}
