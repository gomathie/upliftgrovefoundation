import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import * as z from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(5, 'Please enter a message'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const supabase = getSupabase();
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
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
    console.error('Contact submission error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
