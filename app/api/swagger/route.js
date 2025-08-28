import { NextResponse } from 'next/server';
import swaggerSpec from '../../../config/swagger'; // Adjust path as needed

export async function GET() {
  return NextResponse.json(swaggerSpec);
}