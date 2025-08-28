import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Helper to return JSON responses
const json = (data, status = 200) => NextResponse.json(data, { status });

// Helper to save the photo file
async function savePhotoFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}_${file.name || "photo.jpg"}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "pasajeros");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(join(uploadDir, fileName), buffer);
  return `/uploads/pasajeros/${fileName}`;
}

/**
 * @swagger
 * /api/dorado/pasajeros:
 *   get:
 *     summary: Obtiene todos los pasajeros
 *     tags: [Pasajeros]
 *     responses:
 *       200:
 *         description: Lista de todos los pasajeros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   apellidos:
 *                     type: string
 *                   email:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   foto:
 *                     type: string
 *                     format: url
 *                   vueloId:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
export async function GET() {
  const pasajeros = await prisma.pasajero.findMany({
    include: { vuelo: true }, // opcional
  });
  return json(pasajeros);
}

/**
 * @swagger
 * /api/dorado/pasajeros:
 *   post:
 *     summary: Crea un nuevo pasajero
 *     tags: [Pasajeros]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - email
 *               - telefono
 *               - vueloId
 *               - foto
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del pasajero
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del pasajero
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del pasajero
 *               telefono:
 *                 type: string
 *                 description: Teléfono del pasajero
 *               vueloId:
 *                 type: string
 *                 description: ID del vuelo al que pertenece el pasajero
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen de la foto del pasajero
 *     responses:
 *       200:
 *         description: Pasajero creado exitosamente. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pasajero creado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     apellidos:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     foto:
 *                       type: string
 *                       format: url
 *                     vueloId:
 *                       type: string
 *       400:
 *         description: Datos de entrada inválidos o campos obligatorios faltantes.
 *       500:
 *         description: Error del servidor
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const nombre = formData.get("nombre");
    const apellidos = formData.get("apellidos");
    const email = formData.get("email");
    const telefono = formData.get("telefono");
    const vueloId = formData.get("vueloId");
    const photoFile = formData.get("foto");

    if (!nombre || !apellidos || !email || !telefono || !vueloId || !photoFile) {
      return json({ error: "Todos los campos son obligatorios" }, 400);
    }

    if (!(photoFile instanceof File)) {
      return json({ error: "El archivo 'foto' no es válido" }, 400);
    }

    const imageUrl = await savePhotoFile(photoFile);

    const vueloExists = await prisma.vuelo.findUnique({ where: { id: vueloId } });
    if (!vueloExists) {
      // Cleanup the uploaded file if the flight doesn't exist
      const imagePath = join(process.cwd(), "public", imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return json({ error: "El vuelo seleccionado no existe" }, 400);
    }

    const newPasajero = await prisma.pasajero.create({
      data: {
        nombre: String(nombre),
        apellidos: String(apellidos),
        email: String(email),
        telefono: String(telefono),
        foto: imageUrl,
        vuelo: { connect: { id: vueloId } },
      },
    });

    return json({ message: "Pasajero creado exitosamente", data: newPasajero });
  } catch (error) {
    console.error("Error al crear pasajero:", error);
    return json({ error: error.message || "Error al procesar la solicitud" }, 500);
  }
}