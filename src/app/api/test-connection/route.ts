import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Probar conexión con Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('users')
      .select('count')
      .single();

    if (supabaseError) throw supabaseError;

    return NextResponse.json({
      status: 'success',
      connections: {
        supabase: {
          status: 'connected',
          count: supabaseData?.count || 0
        }
      }
    });
  } catch (error) {
    console.error('Error al probar conexiones:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error al probar la conexión',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 