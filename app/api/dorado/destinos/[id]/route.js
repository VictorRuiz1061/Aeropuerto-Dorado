import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
    const destino = await prisma.destino.findUnique({
      where: { id }, // id es String en Mongo
    });

    if (!destino) {
      return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });
    }
    return NextResponse.json(destino);
} 


export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const destino = await prisma.destino.update({
      where: { id },
      data: {
        descripcion: json.descripcion, // 👈 asegúrate que sea el campo correcto
      },
    });
    return NextResponse.json(destino);
}


export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.destino.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destino eliminado correctamente" });
}
