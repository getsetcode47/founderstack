export interface BlogTopic {
  keyword: string;
  cluster: string;
  intent: string;
  title: string;
}

export const BLOG_TOPIC_SEEDS: BlogTopic[] = [
  {
    keyword: 'startup perks',
    cluster: 'startup perks',
    intent: 'Founders want a reliable directory of perks and discounts.',
    title: 'Best Startup Perks to Claim Before You Pay Full Price',
  },
  {
    keyword: 'founder deals',
    cluster: 'founder deals',
    intent: 'Founders want curated deals that save money on tools.',
    title: 'Founder Deals: Where Startup Teams Can Save on Their Stack',
  },
  {
    keyword: 'startup software discounts',
    cluster: 'software discounts',
    intent: 'Startup teams want discounts on SaaS and operating tools.',
    title: 'Startup Software Discounts Worth Checking This Month',
  },
  {
    keyword: 'cloud credits for startups',
    cluster: 'cloud credits',
    intent: 'Technical founders want free or discounted infrastructure credits.',
    title: 'Cloud Credits for Startups: What to Look For and How to Claim Them',
  },
  {
    keyword: 'AI tool credits for founders',
    cluster: 'AI tools',
    intent: 'Founders want AI credits and discounts for product, support, and marketing workflows.',
    title: 'AI Tool Credits for Founders Building Faster on a Budget',
  },
  {
    keyword: 'SaaS discounts for startups',
    cluster: 'SaaS discounts',
    intent: 'Bootstrapped teams want lower software spend.',
    title: 'SaaS Discounts for Startups: How to Build a Leaner Tool Stack',
  },
  {
    keyword: 'student software offers',
    cluster: 'student offers',
    intent: 'Students want official software offers before building or launching.',
    title: 'Student Software Offers That Also Help Future Founders',
  },
  {
    keyword: 'free startup credits',
    cluster: 'free credits',
    intent: 'Early teams want free credits with official redemption paths.',
    title: 'Free Startup Credits: A Practical Guide for Early-Stage Teams',
  },
];
