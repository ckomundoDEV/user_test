import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Obtener todos los registros de analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*');
    if (analyticsError) throw analyticsError;

    // Obtener cantidad total de usuarios
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (usersError) throw usersError;

    // Calcular el total de page views
    const totalPageViews = analytics?.reduce((acc, row) => acc + (row.page_views ?? 0), 0) ?? 0;

    // Obtener los 5 usuarios más recientes
    const { data: recentUsers, error: recentUsersError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    if (recentUsersError) throw recentUsersError;

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalPageViews,
      recentUsers,
      analytics
    });
  } catch (error) {
    console.error('Error al obtener analytics:', error);
    return NextResponse.json(
      { error: 'Error al obtener analytics' },
      { status: 500 }
    );
  }
} 