import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET (request, {params}) {
    const usuario = await prisma.usuario.findUnique(
        {
            where: {
                id: params.id
            }
        }
    );
    return NextResponse.json(usuario)
}

export async function PUT(request, {params}) {
    try {
        const json = await request.json();
        const usuario = await prisma.usuario.update(
            {
                where: {
                    id: params.id
                },
                data: json
            }
        );
        return NextResponse.json(usuario)
    } catch (error) {
        return NextResponse.json(
            {
                "message": error.message
            },
            {
                status: 500
            }
        )
    }
}

export async function DELETE(request, {params}) {
    try {
        const usuario = await prisma.usuario.delete(
            {
                where: {
                    id: params.id
                }
            }
        );
        return NextResponse.json(usuario)
    } catch (error) {
        return NextResponse.json(
            {
                "message": error.message
            },
            {
                status: 500
            }
        )
    }
}