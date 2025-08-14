import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    const version = process.env.npm_package_version || '1.0.0';
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp,
      version
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: `Health check failed: ${error instanceof Error ? error.message : String(error)}` 
      }, 
      { status: 500 }
    );
  }
}
