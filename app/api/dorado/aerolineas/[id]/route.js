import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/aerolineas/{id}:
 *   get:
 *     summary: Obtiene una aerolínea por ID
 *     tags: [Aerolineas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la aerolínea
 *     responses:
 *       200:
 *         description: Detalles de la aerolínea.
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
 *       404:
 *         description: Aerolínea no encontrada.
 *       500:
 *         description: Error del servidor
 */
export async function GET(request, { params }) {
  const { id } = params;
    const aerolinea = await prisma.aerolinea.findUnique({
      where: { id }, // id es String en Mongo
    });

    if (!aerolinea) {
      return NextResponse.json({ error: "aerolinea no encontrado" }, { status: 404 });
    }
    return NextResponse.json(aerolinea);
} 


/**
 * @swagger
 * /api/dorado/aerolineas/{id}:
 *   put:
 *     summary: Actualiza una aerolínea por ID
 *     tags: [Aerolineas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la aerolínea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción de la aerolínea
 *     responses:
 *       200:
 *         description: Aerolínea actualizada exitosamente.
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
 *       404:
 *         description: Aerolínea no encontrada.
 *       500:
 *         description: Error del servidor
 */
export async function PUT(request, { params }) {
  const { id } = params;
  const json = await request.json();
    const aerolinea = await prisma.aerolinea.update({
      where: { id },
      data: {
        descripcion: json.descripcion, // 👈 asegúrate que sea el campo correcto
      },
    });
    return NextResponse.json(aerolinea);
}


/**
 * @swagger
 * /api/dorado/aerolineas/{id}:
 *   delete:
 *     summary: Elimina una aerolínea por ID
 *     tags: [Aerolineas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la aerolínea a eliminar
 *     responses:
 *       200:
 *         description: Aerolínea eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: aerolinea eliminado correctamente
 *       404:
 *         description: Aerolínea no encontrada.
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(request, { params }) {
  const { id } = params;
    await prisma.aerolinea.delete({
      where: { id },
    });

    return NextResponse.json({ message: "aerolinea eliminado correctamente" });
}