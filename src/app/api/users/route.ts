import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateUserDTO, UpdateUserDTO } from '@/types/user';

// GET /api/users
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const body: CreateUserDTO = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { 
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
} 