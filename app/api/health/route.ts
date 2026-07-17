import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Health check database error:', error);
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'unavailable',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
