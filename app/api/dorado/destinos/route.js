import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/destinos:
 *   get:
 *     summary: Obtiene todos los destinos
 *     tags: [Destinos]
 *     responses:
 *       200:
 *         description: Lista de todos los destinos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del destino
 *                   nombre:
 *                     type: string
 *                     description: Nombre del destino
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del destino
 *       500:
 *         description: Error del servidor
 */
export async function GET () {
    const destinos = await prisma.destino.findMany();
    return NextResponse.json(destinos)
}

/**
 * @swagger
 * /api/dorado/destinos:
 *   post:
 *     summary: Crea un nuevo destino
 *     tags: [Destinos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del destino
 *               descripcion:
 *                 type: string
 *                 description: Descripción del destino
 *     responses:
 *       201:
 *         description: Destino creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       500:
 *         description: Error del servidor
 */
export async function POST(request) {
    const json = await request.json();
    const destino = await prisma.destino.create(
        {})
    return NextResponse.json(destino)
}