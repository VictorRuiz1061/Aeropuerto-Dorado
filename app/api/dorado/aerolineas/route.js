import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/aerolineas:
 *   get:
 *     summary: Obtiene todas las aerolíneas
 *     tags: [Aerolineas]
 *     responses:
 *       200:
 *         description: Lista de todas las aerolíneas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la aerolínea
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la aerolínea
 *                   codigo:
 *                     type: string
 *                     description: Código de la aerolínea
 *       500:
 *         description: Error del servidor
 */
export async function GET () {
    const aerolinea = await prisma.aerolinea.findMany();
    return NextResponse.json(aerolinea)
}

/**
 * @swagger
 * /api/dorado/aerolineas:
 *   post:
 *     summary: Crea una nueva aerolínea
 *     tags: [Aerolineas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - codigo
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la aerolínea
 *               codigo:
 *                 type: string
 *                 description: Código de la aerolínea
 *     responses:
 *       201:
 *         description: Aerolínea creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 codigo:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       500:
 *         description: Error del servidor
 */
export async function POST(request) {
    const json = await request.json();
    const aerolinea = await prisma.aerolinea.create(
        {
            data: json
        }
    );
    return NextResponse.json(aerolinea)
}