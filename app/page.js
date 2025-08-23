'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialState = { email: '', password: '' };

export default function Page() {
  const [form, setForm] = useState(initialState);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/vuelos');
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Enviando formulario:', form);

    try {
      const endpoint = `/api/dorado/auth/${isRegister ? 'register' : 'login'}`;
      console.log('Endpoint:', endpoint);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      console.log('Respuesta recibida:', res);
      const data = await res.json();
      console.log('Datos de la respuesta:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }

      console.log('Login exitoso, guardando token...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/vuelos');

    } catch (err) {
      console.error('Error en el handleSubmit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">VueloApp</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{isRegister ? 'Crea una nueva cuenta' : 'Inicia sesión en tu cuenta'}</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input 
                type="text" 
                name="email"
                placeholder="Email" 
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password"
                placeholder="Contraseña" 
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={loading}>
              {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            <span onClick={() => setIsRegister(!isRegister)} className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
              {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}