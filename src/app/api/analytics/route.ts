import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Obtener estadísticas generales
      const totalUsers = await client.query('SELECT COUNT(*) FROM users');
      const totalPageViews = await client.query('SELECT SUM(page_views) FROM analytics');

      // Obtener usuarios más activos
      const mostActiveUsers = await client.query(`
        SELECT u.id, u.name, COUNT(a.id) as total_views
        FROM users u
        LEFT JOIN analytics a ON u.id = a.user_id
        GROUP BY u.id, u.name
        ORDER BY total_views DESC
        LIMIT 5
      `);

      return NextResponse.json({
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalPageViews: parseInt(totalPageViews.rows[0].sum || '0'),
        mostActiveUsers: mostActiveUsers.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al obtener analytics:', error);
    return NextResponse.json(
      { error: 'Error al obtener analytics' },
      { status: 500 }
    );
  }
} 