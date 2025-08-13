import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateUserDTO, UpdateUserDTO } from '@/types/user';
import { SortDirectionEnum, UserOrderFieldEnum } from '@/types/user';

// GET /api/users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const sort = searchParams.get('sort');

    let supabaseQuery = supabase
      .from('users')
      .select('*');

    // Filtro de búsqueda
    if (query && query.trim() !== '') {
      const searchTerm = query.trim().replace(/[%_]/g, '\\$&');
      supabaseQuery = supabaseQuery.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    // Ordenamiento con validación usando enums
    let orderField = UserOrderFieldEnum.CREATED_AT;
    let orderDirection = SortDirectionEnum.DESC;

    if (sort && sort.includes(':')) {
      const [field, direction] = sort.split(':');
      
      // Validar campo permitido usando enum
      if (Object.values(UserOrderFieldEnum).includes(field as UserOrderFieldEnum)) {
        orderField = field as UserOrderFieldEnum;
      }
      
      // Validar dirección usando enum
      if (Object.values(SortDirectionEnum).includes(direction as SortDirectionEnum)) {
        orderDirection = direction as SortDirectionEnum;
      }
    }

    const { data, error } = await supabaseQuery.order(orderField, { 
      ascending: orderDirection === 'asc' 
    });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
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

