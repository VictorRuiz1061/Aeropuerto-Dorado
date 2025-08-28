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

export async function GET() {
  const pasajeros = await prisma.pasajero.findMany({
    include: { vuelo: true }, // opcional
  });
  return json(pasajeros);
}

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
