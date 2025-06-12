import { NextResponse } from 'next/server';
import { Pool, DatabaseError } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id || !id.startsWith('U')) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('DELETE FROM analytics WHERE user_id = $1', [id]);

      const result = await client.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: 'Usuario eliminado correctamente' });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error(`Error al eliminar usuario con ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor al eliminar usuario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id || !id.startsWith('U')) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

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
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [name, email, id]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } catch (dbError: unknown) {
      if (dbError instanceof DatabaseError && dbError.code === '23505') { 
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
      console.error(`Error al actualizar usuario con ID ${params.id}:`, dbError);
      return NextResponse.json(
        { error: 'Error interno del servidor al actualizar usuario' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error(`Error en la petición PUT para ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error en la petición al servidor' },
      { status: 500 }
    );
  }
} 