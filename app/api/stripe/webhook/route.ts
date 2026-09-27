import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase, isSupabaseConfigured } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json({ message: 'Webhook endpoint received (mock/dev mode)' }, { status: 200 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId && isSupabaseConfigured && supabase) {
          await supabase
            .from('users')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan: 'manager',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        if (isSupabaseConfigured && supabase) {
          await supabase
            .from('users')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', sub.id);
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
