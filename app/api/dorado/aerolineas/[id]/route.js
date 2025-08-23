import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
    const aerolinea = await prisma.aerolinea.findUnique({
      where: { id }, // id es String en Mongo
    });

    if (!aerolinea) {
      return NextResponse.json({ error: "aerolinea no encontrado" }, { status: 404 });
    }
    return NextResponse.json(aerolinea);
} 


export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const aerolinea = await prisma.aerolinea.update({
      where: { id },
      data: {
        descripcion: json.descripcion, // 👈 asegúrate que sea el campo correcto
      },
    });
    return NextResponse.json(aerolinea);
}


export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.aerolinea.delete({
      where: { id },
    });

    return NextResponse.json({ message: "aerolinea eliminado correctamente" });
}
