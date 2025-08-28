import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/vuelos/{id}:
 *   get:
 *     summary: Obtiene un vuelo por ID
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vuelo
 *     responses:
 *       200:
 *         description: Detalles del vuelo.
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
 *       404:
 *         description: Vuelo no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function GET(request, { params }) {
  const { id } = params;
    const vuelo = await prisma.vuelo.findUnique({
      where: { id },
      include: { destino: true, aerolinea: true, pasajeros: true }, // opcional
    });

    if (!vuelo) {
      return NextResponse.json({ error: "Vuelo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(vuelo);
}

/**
 * @swagger
 * /api/dorado/vuelos/{id}:
 *   put:
 *     summary: Actualiza un vuelo por ID
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vuelo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Vuelo actualizado exitosamente.
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
 *       404:
 *         description: Vuelo no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const vuelo = await prisma.vuelo.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(vuelo);
}

/**
 * @swagger
 * /api/dorado/vuelos/{id}:
 *   delete:
 *     summary: Elimina un vuelo por ID
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vuelo a eliminar
 *     responses:
 *       200:
 *         description: Vuelo eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vuelo eliminado correctamente
 *       404:
 *         description: Vuelo no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.vuelo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vuelo eliminado correctamente" });
}