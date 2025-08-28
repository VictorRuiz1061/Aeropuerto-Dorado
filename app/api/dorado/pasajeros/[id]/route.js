import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Helper to return JSON responses
const json = (data, status = 200) => NextResponse.json(data, { status });

// Helper to save the photo file
async function savePhotoFile(file) {
  if (!file || !(file instanceof File)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}_${file.name || "photo.jpg"}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "pasajeros");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/pasajeros/${fileName}`;
}

// Helper to delete a file
function deletePhotoFile(filePath) {
  if (!filePath) return;
  const fullPath = join(process.cwd(), "public", filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(`Error deleting file: ${fullPath}`, error);
    }
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const pasajero = await prisma.pasajero.findUnique({
      where: { id },
      include: { vuelo: true },
    });

    if (!pasajero) {
      return json({ error: "Pasajero no encontrado" }, 404);
    }

    return json(pasajero);
  } catch (error) {
    console.error("Error fetching pasajero:", error);
    return json({ error: "Error al obtener el pasajero" }, 500);
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const dataToUpdate = {};

    // Get current passenger to check for old photo
    const currentPasajero = await prisma.pasajero.findUnique({ where: { id } });
    if (!currentPasajero) {
      return json({ error: "Pasajero no encontrado" }, 404);
    }

    // Handle file upload
    const photoFile = formData.get("foto");
    if (photoFile && photoFile instanceof File) {
      const newImageUrl = await savePhotoFile(photoFile);
      if (newImageUrl) {
        dataToUpdate.foto = newImageUrl;
        // Delete old photo if it exists
        deletePhotoFile(currentPasajero.foto);
      }
    }

    // Collect other fields from form
    const fields = ["nombre", "apellidos", "email", "telefono", "vueloId"];
    for (const field of fields) {
      if (formData.has(field)) {
        dataToUpdate[field] = formData.get(field);
      }
    }
    
    // If connecting to a new vuelo, format it for Prisma
    if (dataToUpdate.vueloId) {
        const vueloExists = await prisma.vuelo.findUnique({ where: { id: dataToUpdate.vueloId } });
        if (!vueloExists) {
            return json({ error: "El vuelo seleccionado no existe" }, 400);
        }
        dataToUpdate.vuelo = { connect: { id: dataToUpdate.vueloId } };
        delete dataToUpdate.vueloId; // remove field to avoid conflict
    }

    const updatedPasajero = await prisma.pasajero.update({
      where: { id },
      data: dataToUpdate,
    });

    return json({ message: "Pasajero actualizado exitosamente", data: updatedPasajero });
  } catch (error) {
    console.error("Error al actualizar pasajero:", error);
    return json({ error: error.message || "Error al procesar la solicitud" }, 500);
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    // First, find the passenger to get the photo path
    const pasajero = await prisma.pasajero.findUnique({
      where: { id },
    });

    if (!pasajero) {
      return json({ error: "Pasajero no encontrado" }, 404);
    }

    // Delete the photo file from the filesystem
    deletePhotoFile(pasajero.foto);

    // Then, delete the passenger record from the database
    await prisma.pasajero.delete({
      where: { id },
    });

    return json({ message: "Pasajero eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar pasajero:", error);
    return json({ error: "Error al procesar la solicitud" }, 500);
  }
}
