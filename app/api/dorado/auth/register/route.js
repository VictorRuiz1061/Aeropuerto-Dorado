import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function validateEmail(email) {
  // Validación básica de email
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validaciones
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y contraseña son requeridos' }), { status: 400 });
    }
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'El email no es válido' }), { status: 400 });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }), { status: 400 });
    }
    
    // Verificar si el usuario ya existe usando findFirst en lugar de findUnique
    const existingUser = await prisma.usuario.findFirst({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'El usuario ya existe' }), { status: 409 });
    }
    
    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.usuario.create({ 
      data: { 
        email, 
        password: hashedPassword 
      } 
    });
    
    // Generar token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    return new Response(JSON.stringify({ 
      token,
      user: {
        id: user.id,
        email: user.email
      }
    }), { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
