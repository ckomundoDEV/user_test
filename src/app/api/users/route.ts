import { NextResponse } from 'next/server';
import { Pool, DatabaseError } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users ORDER BY id');
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      return NextResponse.json(result.rows[0]);
    } catch (dbError: unknown) {
      if (dbError instanceof DatabaseError && dbError.code === '23505') { // unique_violation
        if (dbError.detail?.includes('email')) {
          return NextResponse.json(
            { error: `El email ${email} ya está registrado.` },
            { status: 409 }
          );
        } else if (dbError.detail?.includes('name')) {
          return NextResponse.json(
            { error: `El nombre ${name} ya está en uso.` },
            { status: 409 }
          );
        }
      }
      console.error('Error al crear usuario:', dbError);
      return NextResponse.json(
        { error: 'Error interno del servidor al crear usuario' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error('Error en la petición POST:', error);
    return NextResponse.json(
      { error: 'Error en la petición al servidor' },
      { status: 500 }
    );
  }
} 