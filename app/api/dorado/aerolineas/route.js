import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET () {
    const aerolinea = await prisma.aerolinea.findMany();
    return NextResponse.json(aerolinea)
}

export async function POST(request) {
    const json = await request.json();
    const aerolinea = await prisma.aerolinea.create(
        {
            data: json
        }
    );
    return NextResponse.json(aerolinea)
}
