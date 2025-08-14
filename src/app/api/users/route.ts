import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateUserDTO, UpdateUserDTO, UserPaginatedResponse, PageSize } from '@/types/user';
import { SortDirectionEnum, UserOrderFieldEnum } from '@/types/user';

// GET /api/users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10') as PageSize;

    // Validar paginación
    if (page < 1) {
      return NextResponse.json(
        { error: 'El parámetro page debe ser mayor a 0' },
        { status: 400 }
      );
    }
    
    if (![5, 10, 20].includes(pageSize)) {
      return NextResponse.json(
        { error: 'El parámetro pageSize debe ser 5, 10 o 20' },
        { status: 400 }
      );
    }
    
    const validPage = page;
    const validPageSize = pageSize;
    
    // Query para contar total (sin paginación)
    let countQuery = supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Query para datos (con paginación)  
    let dataQuery = supabase
      .from('users')
      .select('*');

    // Aplicar filtros a ambas queries
    if (query && query.trim() !== '') {
      const searchTerm = query.trim().replace(/[%_]/g, '\\$&');
      const searchFilter = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
      countQuery = countQuery.or(searchFilter);
      dataQuery = dataQuery.or(searchFilter);
    }

    let orderField = UserOrderFieldEnum.CREATED_AT;
    let orderDirection = SortDirectionEnum.DESC;

    if (sort && sort.includes(':')) {
      const [field, direction] = sort.split(':');
      
      if (!Object.values(UserOrderFieldEnum).includes(field as UserOrderFieldEnum)) {
        return NextResponse.json(
          { error: `Campo de ordenamiento inválido. Permitidos: ${Object.values(UserOrderFieldEnum).join(', ')}` },
          { status: 400 }
        );
      }
      
      if (!Object.values(SortDirectionEnum).includes(direction as SortDirectionEnum)) {
        return NextResponse.json(
          { error: `Dirección de ordenamiento inválida. Permitidas: ${Object.values(SortDirectionEnum).join(', ')}` },
          { status: 400 }
        );
      }
      
      orderField = field as UserOrderFieldEnum;
      orderDirection = direction as SortDirectionEnum;
    } else if (sort && sort.trim() !== '') {
      return NextResponse.json(
        { error: 'El parámetro sort debe tener formato campo:direccion (ej: created_at:desc)' },
        { status: 400 }
      );
    }

    const offset = (validPage - 1) * validPageSize;
    const limit = offset + validPageSize - 1;

    dataQuery = dataQuery
      .order(orderField, { ascending: orderDirection === 'asc' })
      .range(offset, limit);

    const [{ count }, { data, error }] = await Promise.all([
      countQuery,
      dataQuery
    ]);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / validPageSize);

    const response: UserPaginatedResponse = {
      items: data || [],
      meta: {
        total,
        page: validPage,
        pageSize: validPageSize,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      }
    };

    return NextResponse.json(response);
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

