import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decodeSession } from '@/lib/auth-session';
import { getPublishedDeals } from '@/lib/site-data';
import { recommendDealsForFounder, type FounderOnboardingAnswers } from '@/lib/onboarding-recommendations';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { getRequestIp } from '@/lib/security/request';

function normalizeString(value: unknown) {
  return String(value ?? '').trim();
}

function normalizeArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? '').trim()).filter(Boolean);
}

function validateAnswers(body: any): FounderOnboardingAnswers | null {
  const answers: FounderOnboardingAnswers = {
    startupName: normalizeString(body?.startupName),
    startupIdea: normalizeString(body?.startupIdea),
    startupStage: normalizeString(body?.startupStage),
    teamSize: normalizeString(body?.teamSize),
    customerType: normalizeString(body?.customerType),
    businessModel: normalizeString(body?.businessModel),
    primaryGoal: normalizeString(body?.primaryGoal),
    priorityCategories: normalizeArray(body?.priorityCategories),
    goToMarketChannels: normalizeArray(body?.goToMarketChannels),
  };

  if (
    !answers.startupIdea ||
    !answers.startupStage ||
    !answers.teamSize ||
    !answers.customerType ||
    !answers.businessModel ||
    !answers.primaryGoal ||
    answers.priorityCategories.length === 0
  ) {
    return null;
  }

  return answers;
}

export async function POST(request: Request) {
  try {
    const session = decodeSession(request.headers.get('cookie')?.match(/(?:^|;\s*)fsh_session=([^;]+)/)?.[1]);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const ipLimit = applyRateLimit(`onboarding:complete:${getRequestIp(request)}`, {
      windowMs: 10 * 60 * 1000,
      max: 20,
    });

    if (!ipLimit.allowed) {
      return NextResponse.json({ error: 'Too many onboarding requests. Please try again shortly.' }, { status: 429 });
    }

    const body = await request.json();
    const answers = validateAnswers(body);

    if (!answers) {
      return NextResponse.json({ error: 'Please complete all required onboarding fields.' }, { status: 400 });
    }

    const deals = await getPublishedDeals();
    const recommendations = recommendDealsForFounder(deals, answers, 10);
    const supabase = createAdminClient();

    await supabase.from('founder_onboarding_profiles').upsert({
      user_id: session.user.id,
      startup_name: answers.startupName || null,
      startup_idea: answers.startupIdea,
      startup_stage: answers.startupStage,
      team_size: answers.teamSize,
      customer_type: answers.customerType,
      business_model: answers.businessModel,
      primary_goal: answers.primaryGoal,
      priority_categories: answers.priorityCategories,
      go_to_market_channels: answers.goToMarketChannels,
      recommended_slugs: recommendations.map((deal) => deal.slug),
    });

    await supabase
      .from('profiles')
      .update({
        interests: answers.priorityCategories,
        onboarding_completed: true,
      })
      .eq('id', session.user.id);

    return NextResponse.json({
      recommendations: recommendations.map((deal) => ({
        id: deal.id,
        slug: deal.slug,
        name: deal.name,
        category: deal.category,
        headline: deal.deal_headline,
        description: deal.description,
        logo_image_url: deal.logo_image_url,
        discount_method: deal.discount_method,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to complete onboarding.' }, { status: 500 });
  }
}
