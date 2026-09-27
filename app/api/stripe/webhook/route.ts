import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { isPostgresConfigured } from '@/lib/db';
import { queryPostgres } from '@/lib/postgres';

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

        if (userId && isPostgresConfigured) {
          await queryPostgres(
            'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2, plan = $3, updated_at = now() WHERE id = $4',
            [customerId, subscriptionId, 'manager', userId]
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        if (isPostgresConfigured) {
          await queryPostgres(
            'UPDATE users SET plan = $1, updated_at = now() WHERE stripe_subscription_id = $2',
            ['free', sub.id]
          );
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
