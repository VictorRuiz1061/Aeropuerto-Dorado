import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/destinos/{id}:
 *   get:
 *     summary: Obtiene un destino por ID
 *     tags: [Destinos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Detalles del destino.
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
 *       404:
 *         description: Destino no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function GET(request, { params }) {
  const { id } = params;
    const destino = await prisma.destino.findUnique({
      where: { id }, // id es String en Mongo
    });

    if (!destino) {
      return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });
    }
    return NextResponse.json(destino);
} 


/**
 * @swagger
 * /api/dorado/destinos/{id}:
 *   put:
 *     summary: Actualiza un destino por ID
 *     tags: [Destinos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del destino
 *     responses:
 *       200:
 *         description: Destino actualizado exitosamente.
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
 *       404:
 *         description: Destino no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const destino = await prisma.destino.update({
      where: { id },
      data: {
        descripcion: json.descripcion, // 👈 asegúrate que sea el campo correcto
      },
    });
    return NextResponse.json(destino);
}


/**
 * @swagger
 * /api/dorado/destinos/{id}:
 *   delete:
 *     summary: Elimina un destino por ID
 *     tags: [Destinos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino a eliminar
 *     responses:
 *       200:
 *         description: Destino eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Destino eliminado correctamente
 *       404:
 *         description: Destino no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.destino.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destino eliminado correctamente" });
}