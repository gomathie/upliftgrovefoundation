import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import * as z from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const volunteerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  skills: z.string().min(1, 'Please select your skills/interests'),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = volunteerSchema.parse(body);

    const supabase = getSupabase();
    const { error } = await supabase
      .from('volunteer_applications')
      .insert({
        full_name: data.full_name,
        email: data.email,
        skills: data.skills,
        message: data.message || null,
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Volunteer submission error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
