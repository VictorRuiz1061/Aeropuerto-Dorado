import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const pasajeros = await prisma.pasajero.findMany({
    include: { vuelo: true }, // opcional
  });
  return NextResponse.json(pasajeros);
}

export async function POST(request) {
  const json = await request.json();
  const pasajero = await prisma.pasajero.create({
    data: json,
  });
  return NextResponse.json(pasajero);
}
