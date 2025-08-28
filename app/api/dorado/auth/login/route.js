import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function validateEmail(email) {
  // Validación básica de email
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/**
 * @swagger
 * /api/dorado/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna un token JWT y los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación JWT
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Credenciales inválidas o datos faltantes.
 *       401:
 *         description: Usuario o contraseña incorrectos.
 *       500:
 *         description: Error interno del servidor.
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Debes ingresar email y contraseña.' }), { status: 400 });
    }
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'El email no es válido.' }), { status: 400 });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres.' }), { status: 400 });
    }
    const user = await prisma.usuario.findFirst({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario o contraseña incorrectos.' }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Usuario o contraseña incorrectos.' }), { status: 401 });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return new Response(JSON.stringify({ 
      token, 
      user: { id: user.id, email: user.email }
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), { status: 500 });
  }
}

// Utilidad para proteger rutas con JWT
export function verifyJWT(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return null;
  }
  const token = auth.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}