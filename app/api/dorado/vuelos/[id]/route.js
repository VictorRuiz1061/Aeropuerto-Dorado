import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
    const vuelo = await prisma.vuelo.findUnique({
      where: { id },
      include: { destino: true, aerolinea: true, pasajeros: true }, // opcional
    });

    if (!vuelo) {
      return NextResponse.json({ error: "Vuelo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(vuelo);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const vuelo = await prisma.vuelo.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(vuelo);
}

export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.vuelo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vuelo eliminado correctamente" });
}
