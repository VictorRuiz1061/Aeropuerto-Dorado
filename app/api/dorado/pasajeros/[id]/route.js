import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
    const pasajero = await prisma.pasajero.findUnique({
      where: { id },
      include: { vuelos: true }, // opcional
    });

    if (!pasajero) {
      return NextResponse.json({ error: "Pasajero no encontrado" }, { status: 404 });
    }

    return NextResponse.json(pasajero);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const pasajero = await prisma.pasajero.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(pasajero);
}

export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.pasajero.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pasajero eliminado correctamente" });
}
