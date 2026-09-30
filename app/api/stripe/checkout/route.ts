import { NextResponse } from 'next/server';
import { createCheckoutSession, PLANS } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://saas-product.antideploy.com';
    const body = await request.json();
    const { planId, returnUrl = origin } = body;
    const plan = planId === 'team' ? PLANS.team : PLANS.manager;

    const result = await createCheckoutSession({
      userId: 'user_current_lead',
      userEmail: 'ops.lead@startup.com',
      priceId: plan.priceId,
      planName: `MeetingDebt - ${plan.name}`,
      amountInCents: plan.price * 100,
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
