import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import * as z from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const partnershipSchema = z.object({
  organization_name: z.string().min(1, 'Organization name is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Please enter a valid email'),
  partnership_idea: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = partnershipSchema.parse(body);

    const supabase = getSupabase();
    const { error } = await supabase
      .from('partnership_inquiries')
      .insert({
        organization_name: data.organization_name,
        contact_person: data.contact_person,
        email: data.email,
        partnership_idea: data.partnership_idea || null,
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
    console.error('Partnership submission error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
