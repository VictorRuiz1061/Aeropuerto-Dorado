import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const vuelos = await prisma.vuelo.findMany({
    include: { destino: true, aerolinea: true, pasajeros: true }, // opcional, para traer relaciones
  });
  return NextResponse.json(vuelos);
}

export async function POST(request) {
  const json = await request.json();
  const vuelo = await prisma.vuelo.create({
    data: json,
  });
  return NextResponse.json(vuelo);
}
