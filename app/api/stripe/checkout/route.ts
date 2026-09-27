import { NextResponse } from 'next/server';
import { createCheckoutSession, PLANS } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { planId, returnUrl = 'http://localhost:3000' } = await request.json();
    const plan = planId === 'team' ? PLANS.team : PLANS.manager;

    const result = await createCheckoutSession({
      userId: 'user_current_lead',
      userEmail: 'ops.lead@startup.com',
      priceId: plan.priceId,
      returnUrl,
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
