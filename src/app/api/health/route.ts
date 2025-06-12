import { NextResponse } from 'next/server';

export async function GET() {
  try {
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: `Health check failed: ${errorMessage}` },
      { status: 500 }
    );
  }
} 