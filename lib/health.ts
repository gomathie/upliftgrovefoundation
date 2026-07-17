import { getSupabase } from '@/lib/supabase';

export type HealthStatus = {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'unavailable';
  timestamp: string;
};

export async function getHealthStatus(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('admin_users').select('id').limit(1);

    if (error) {
      console.error('Health check database error:', error);
      return {
        status: 'unhealthy',
        database: 'unavailable',
        timestamp,
      };
    }

    return {
      status: 'healthy',
      database: 'connected',
      timestamp,
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      database: 'unavailable',
      timestamp,
    };
  }
}
