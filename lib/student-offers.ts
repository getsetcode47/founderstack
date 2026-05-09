import { getFallbackDealLogoUrl } from '@/lib/founderstack';
import type { Deal } from '@/types';

export interface StudentOffer {
  slug: string;
  name: string;
  provider: string;
  category:
    | 'AI Tools'
    | 'Design & Creative'
    | 'Developer Tools'
    | 'Learning'
    | 'Productivity'
    | 'Entertainment';
  savings: string;
  headline: string;
  description: string;
  eligibility: string[];
  instructions: string[];
  redeemUrl: string;
  verification: string;
  timing: string;
  brandColor: string;
}

export const studentOffers: StudentOffer[] = [
  {
    slug: 'cursor-pro-student',
    name: 'Cursor Pro',
    provider: 'Cursor',
    category: 'AI Tools',
    savings: '$240/yr',
    headline: 'Free Cursor Pro for eligible university students.',
    description:
      'Cursor Pro is an AI-first code editor built for pair programming with AI. Students get free access to Pro features including GPT-4, unlimited AI completions, and advanced code generation.',
    eligibility: ['Students'],
    instructions: [
      'Visit the official Cursor Students page.',
      'Sign up with your .edu email address.',
      'Verify your student status.',
      'Unlock Cursor Pro features on your account.',
    ],
    redeemUrl: 'https://cursor.com/students',
    verification: '.edu email verification',
    timing: 'Usually instant after verification',
    brandColor: '#3b82f6',
  },
  {
    slug: 'figma-education',
    name: 'Figma for Education',
    provider: 'Figma',
    category: 'Design & Creative',
    savings: '$144/yr',
    headline: 'Free Figma Professional access for students and educators.',
    description:
      'Figma for Education provides free access to Figma Professional and FigJam for students and educators. Includes unlimited files, projects, team libraries, and advanced prototyping features.',
    eligibility: ['Students'],
    instructions: [
      'Open the official Figma for Education page.',
      'Apply with your .edu or school email address.',
      'Complete student verification.',
      'Upgrade to the education plan and start using Professional features.',
    ],
    redeemUrl: 'https://www.figma.com/education/',
    verification: 'Education verification',
    timing: 'Usually same day',
    brandColor: '#f97316',
  },
  {
    slug: 'framer-education',
    name: 'Framer for Education',
    provider: 'Framer',
    category: 'Design & Creative',
    savings: '$240/yr',
    headline: 'Free Framer student access for portfolios and websites.',
    description:
      'Framer is a powerful design and prototyping tool that lets you create interactive websites without code. Students get free access to Pro features including unlimited projects and custom domains.',
    eligibility: ['Students'],
    instructions: [
      'Visit the official Framer students page.',
      'Apply with your student email address.',
      'Verify your current enrollment.',
      'Access Framer Pro features after approval.',
    ],
    redeemUrl: 'https://www.framer.com/students/',
    verification: 'Student enrollment verification',
    timing: 'Depends on verification review',
    brandColor: '#8b5cf6',
  },
  {
    slug: 'gitlab-education',
    name: 'GitLab for Education',
    provider: 'GitLab',
    category: 'Developer Tools',
    savings: '$1188/yr',
    headline: 'Free GitLab Ultimate access for education use.',
    description:
      'GitLab for Education provides free access to GitLab Ultimate for students and educators. Includes unlimited private repos, CI/CD pipelines, security scanning, and collaboration tools.',
    eligibility: ['Students'],
    instructions: [
      'Open the GitLab for Education application page.',
      'Apply using your school email address.',
      'Verify your student status.',
      'Get access to GitLab Ultimate once approved.',
    ],
    redeemUrl: 'https://about.gitlab.com/solutions/education/join/',
    verification: 'School email and education review',
    timing: 'Review-based approval',
    brandColor: '#fc6d26',
  },
  {
    slug: 'medium-student',
    name: 'Medium Student Membership',
    provider: 'Medium',
    category: 'Learning',
    savings: '$25/yr savings',
    headline: 'Student pricing on Medium membership.',
    description:
      'Medium offers students 25% off their membership. Get unlimited access to member-only stories, audio narrations, and support your favorite writers.',
    eligibility: ['Students 16+ in supported countries'],
    instructions: [
      'Create a free UNiDAYS account and verify your student status.',
      'Open Medium’s official student discount instructions.',
      'Follow the redirect to Medium from the student offer flow.',
      'Choose a monthly or annual plan and complete checkout.',
    ],
    redeemUrl: 'https://help.medium.com/hc/en-us/articles/12846216085143-Redeeming-student-discounts',
    verification: 'UNiDAYS student verification',
    timing: 'Immediate after successful verification',
    brandColor: '#16a34a',
  },
  {
    slug: 'microsoft-365-education',
    name: 'Microsoft 365 Education',
    provider: 'Microsoft',
    category: 'Productivity',
    savings: '$150/yr',
    headline: 'Free Office apps and cloud tools for eligible students.',
    description:
      'Microsoft 365 Education gives students free access to Word, Excel, PowerPoint, OneNote, Teams, and 1TB OneDrive storage. Available to students at eligible institutions worldwide.',
    eligibility: ['Students with an eligible school email'],
    instructions: [
      'Open the official Microsoft Education page.',
      'Enter your school email address.',
      'Verify your student eligibility.',
      'Download Office apps or start using the web apps.',
    ],
    redeemUrl: 'https://www.microsoft.com/en-us/education/products/office/',
    verification: 'Eligible school email',
    timing: 'Usually immediate',
    brandColor: '#2563eb',
  },
  {
    slug: 'miro-education',
    name: 'Miro Education',
    provider: 'Miro',
    category: 'Productivity',
    savings: '$120/yr',
    headline: 'Free Miro Education plan for eligible students.',
    description:
      'Miro is an online collaborative whiteboard platform. Students and educators get free access to the Education plan with unlimited boards, templates, and real-time collaboration features.',
    eligibility: ['Students at accredited educational institutions'],
    instructions: [
      'Open the Miro Education plan page.',
      'Review the eligibility requirements for students.',
      'Submit the education application with your school email or proof of enrollment.',
      'Wait for Miro to approve and activate your Education team.',
    ],
    redeemUrl: 'https://help.miro.com/hc/en-us/articles/360017730473-Education-plan',
    verification: 'School email or enrollment proof',
    timing: 'Can take up to 10 days',
    brandColor: '#2563eb',
  },
  {
    slug: 'spotify-premium-student',
    name: 'Spotify Premium Student',
    provider: 'Spotify',
    category: 'Entertainment',
    savings: '$72/yr savings',
    headline: 'Discounted Spotify Premium plan for students.',
    description:
      'Spotify Premium Student gives you ad-free music, offline downloads, and unlimited skips at a discounted student rate. In some regions, extra bundled streaming perks may also be included.',
    eligibility: ['Students at eligible higher education institutions'],
    instructions: [
      'Visit the official Spotify Premium Student page.',
      'Sign up or log in to your Spotify account.',
      'Verify your student status through SheerID.',
      'Activate Premium Student pricing on your account.',
    ],
    redeemUrl: 'https://www.spotify.com/us/student/',
    verification: 'SheerID verification',
    timing: 'Usually immediate after approval',
    brandColor: '#1db954',
  },
  {
    slug: 'youtube-premium-student',
    name: 'YouTube Premium Student',
    provider: 'Google',
    category: 'Entertainment',
    savings: '$72/yr savings',
    headline: 'Lower student pricing for YouTube Premium.',
    description:
      'YouTube Premium Student gives you ad-free YouTube, background play, offline downloads, and YouTube Music Premium at a discounted student rate in supported countries.',
    eligibility: ['Students at SheerID-approved higher education institutions'],
    instructions: [
      'Open the official YouTube student membership guide.',
      'Sign in with your Google account.',
      'Start the student membership flow and verify through SheerID.',
      'Subscribe at the discounted student rate once approved.',
    ],
    redeemUrl: 'https://support.google.com/youtube/answer/9158808?hl=en',
    verification: 'SheerID verification',
    timing: 'Usually immediate after approval',
    brandColor: '#ef4444',
  },
];

export const studentOfferStats = {
  totalOffers: studentOffers.length,
  categories: Array.from(new Set(studentOffers.map((offer) => offer.category))).length,
  maxSavingsHighlight: '$1,188/yr',
};

export function getStudentOfferLogo(name: string) {
  return getFallbackDealLogoUrl({ name });
}

export function getStudentOfferHref(slug: string) {
  return `/student-offers/${slug}`;
}

export function getStudentOfferBySlug(slug: string) {
  return studentOffers.find((offer) => offer.slug === slug);
}

export function getRelatedStudentOffers(current: StudentOffer, limit = 3) {
  return studentOffers.filter((offer) => offer.slug !== current.slug && offer.category === current.category).slice(0, limit);
}

export function studentOfferToDeal(offer: StudentOffer, index: number): Deal {
  return {
    id: `student-${offer.slug}`,
    slug: offer.slug,
    name: offer.name,
    short_name: offer.provider,
    logo_type: 'image',
    logo_image_url: getStudentOfferLogo(offer.provider),
    logo_text: offer.provider.slice(0, 2).toUpperCase(),
    brand_color: offer.brandColor,
    description: offer.description,
    full_description: `${offer.description}\n\nEligibility:\n${offer.eligibility.map((item) => `- ${item}`).join('\n')}\n\nHow to redeem:\n${offer.instructions.map((item, step) => `${step + 1}. ${item}`).join('\n')}`,
    category: offer.category,
    deal_headline: offer.savings,
    deal_details: offer.headline,
    eligibility: offer.eligibility.join(' • '),
    discount_method: 'link',
    discount_code: null,
    discount_url: offer.redeemUrl,
    out_of_credits: false,
    featured: index < 6,
    published: true,
    sort_order: index,
    meta_title: `${offer.name} Student Offer | Founder Stack Hub`,
    meta_description: offer.description,
    created_at: '2026-04-21T00:00:00.000Z',
    updated_at: '2026-04-21T00:00:00.000Z',
  };
}
