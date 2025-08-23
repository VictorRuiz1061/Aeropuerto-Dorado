import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET () {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios)
}

export async function POST(request) {
    const json = await request.json();
    const usuario = await prisma.usuario.create(
        {
            data: json
        }
    );
    return NextResponse.json(usuario)
}