import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/vuelos:
 *   get:
 *     summary: Obtiene todos los vuelos
 *     tags: [Vuelos]
 *     responses:
 *       200:
 *         description: Lista de todos los vuelos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   numeroVuelo:
 *                     type: string
 *                   origen:
 *                     type: string
 *                   destinoId:
 *                     type: string
 *                   aerolineaId:
 *                     type: string
 *                   fechaSalida:
 *                     type: string
 *                     format: date-time
 *                   fechaLlegada:
 *                     type: string
 *                     format: date-time
 *                   precio:
 *                     type: number
 *                     format: float
 *       500:
 *         description: Error del servidor
 */
export async function GET() {
  const vuelos = await prisma.vuelo.findMany({
    include: { destino: true, aerolinea: true, pasajeros: true }, // opcional, para traer relaciones
  });
  return NextResponse.json(vuelos);
}

/**
 * @swagger
 * /api/dorado/vuelos:
 *   post:
 *     summary: Crea un nuevo vuelo
 *     tags: [Vuelos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroVuelo
 *               - origen
 *               - destinoId
 *               - aerolineaId
 *               - fechaSalida
 *               - fechaLlegada
 *               - precio
 *             properties:
 *               numeroVuelo:
 *                 type: string
 *                 description: Número de vuelo
 *               origen:
 *                 type: string
 *                 description: Origen del vuelo
 *               destinoId:
 *                 type: string
 *                 description: ID del destino
 *               aerolineaId:
 *                 type: string
 *                 description: ID de la aerolínea
 *               fechaSalida:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de salida del vuelo
 *               fechaLlegada:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de llegada del vuelo
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Precio del vuelo
 *     responses:
 *       201:
 *         description: Vuelo creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 numeroVuelo:
 *                   type: string
 *                 origen:
 *                   type: string
 *                 destinoId:
 *                   type: string
 *                 aerolineaId:
 *                   type: string
 *                 fechaSalida:
 *                   type: string
 *                   format: date-time
 *                 fechaLlegada:
 *                   type: string
 *                   format: date-time
 *                 precio:
 *                   type: number
 *                   format: float
 *       400:
 *         description: Datos de entrada inválidos.
 *       500:
 *         description: Error del servidor
 */
export async function POST(request) {
  const json = await request.json();
  const vuelo = await prisma.vuelo.create({
    data: json,
  });
  return NextResponse.json(vuelo);
}