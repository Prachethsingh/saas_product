/**
 * Stripe Billing & Subscriptions
 * 
 * Pricing tiers:
 * - Free: 1 calendar, basic zombie scores, manual copy drafts
 * - Manager ($15/seat/mo): Full historical decay analysis, Slack auto-draft integration, unlimited syncs
 * - Team ($299/mo flat): Unlimited seats, organization-wide meeting audit, company waste analytics
 */

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    interval: 'month',
    features: [
      '1 Google Calendar connected',
      'Observation mode & basic zombie score',
      'Manual Slack draft generator',
      'Last 30-day occurrence history',
    ],
  },
  manager: {
    id: 'manager',
    name: 'Manager Pro',
    price: 15,
    interval: 'seat/mo',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MANAGER_SEAT || 'price_manager_sample',
    features: [
      'Everything in Free',
      'Full 90-day attendance decay analysis',
      'Slack Bot 1-click channel drafting',
      'Automated nightly rescoring cron',
      'Dollar waste / ROI calculator',
      'Duration & agenda optimization hints',
    ],
  },
  team: {
    id: 'team',
    name: 'Team & Org Flat',
    price: 299,
    interval: 'month (flat)',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_FLAT || 'price_team_sample',
    features: [
      'Everything in Manager Pro',
      'Unlimited manager & team seats',
      'Organization-wide calendar audit',
      'Company executive waste dashboard',
      'Priority Slack & email support',
      'Custom webhook & HRIS sync (v2)',
    ],
  },
};

export async function createCheckoutSession(params: {
  userId: string;
  userEmail: string;
  priceId: string;
  returnUrl: string;
  quantity?: number;
}) {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Return mock checkout URL for local testing
    return {
      url: `${params.returnUrl}?session_id=mock_cs_${Date.now()}&status=success`,
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    customer_email: params.userEmail,
    client_reference_id: params.userId,
    line_items: [
      {
        price: params.priceId,
        quantity: params.quantity || 1,
      },
    ],
    mode: 'subscription',
    success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${params.returnUrl}?canceled=true`,
    metadata: {
      userId: params.userId,
    },
  });

  return { url: session.url };
}
