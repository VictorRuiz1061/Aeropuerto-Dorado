import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET () {
    const destinos = await prisma.destino.findMany();
    return NextResponse.json(destinos)
}

export async function POST(request) {
    const json = await request.json();
    const destino = await prisma.destino.create(
        {
            data: json
        }
    );
    return NextResponse.json(destino)
}
