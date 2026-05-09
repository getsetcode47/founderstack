import { NextRequest, NextResponse } from 'next/server';

function initials(name: string, shortName?: string | null, logoText?: string | null) {
  if (logoText?.trim()) return logoText.trim().slice(0, 3).toUpperCase();
  if (shortName?.trim()) return shortName.trim().slice(0, 3).toUpperCase();
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name') || 'Founder Stack Hub';
  const brand = searchParams.get('brand') || '#111111';
  const shortName = searchParams.get('short');
  const logoText = searchParams.get('logoText');
  const logo = searchParams.get('logo');
  const safeBrand = /^#[0-9A-Fa-f]{3,8}$/.test(brand) ? brand : '#111111';
  const safeName = name.replace(/[<&>"]/g, '');
  const safeShort = (shortName || safeName).replace(/[<&>"]/g, '').slice(0, 20);
  const safeInitials = initials(name, shortName, logoText).replace(/[<&>"]/g, '');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
      <rect width="1200" height="900" rx="48" fill="#f4f1ea"/>
      <rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#bg)"/>
      <rect x="58" y="58" width="1084" height="784" rx="28" fill="#faf8f2" stroke="rgba(0,0,0,0.08)"/>
      <circle cx="1040" cy="136" r="132" fill="${safeBrand}" fill-opacity="0.14"/>
      <circle cx="188" cy="736" r="176" fill="${safeBrand}" fill-opacity="0.10"/>
      <rect x="112" y="112" width="976" height="486" rx="30" fill="#ffffff"/>
      <rect x="112" y="112" width="976" height="486" rx="30" fill="url(#mesh)"/>
      <rect x="144" y="144" width="190" height="190" rx="44" fill="#ffffff" stroke="rgba(0,0,0,0.06)"/>
      ${
        logo
          ? `<image href="${logo}" x="177" y="177" width="124" height="124" preserveAspectRatio="xMidYMid meet" />`
          : `<text x="239" y="254" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#111111">${safeInitials}</text>`
      }
      <text x="144" y="396" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="700" fill="#111111">${safeShort}</text>
      <text x="144" y="462" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500" fill="rgba(17,17,17,0.62)">Founder Stack Hub</text>
      <rect x="144" y="658" width="220" height="58" rx="29" fill="#111111"/>
      <text x="254" y="695" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#ffffff">Claim deal</text>
      <text x="144" y="772" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="rgba(17,17,17,0.68)">Official brand mark poster</text>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="900" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f7f4ef"/>
          <stop offset="1" stop-color="#f1ede5"/>
        </linearGradient>
        <linearGradient id="mesh" x1="112" y1="112" x2="1088" y2="598" gradientUnits="userSpaceOnUse">
          <stop stop-color="${safeBrand}" stop-opacity="0.16"/>
          <stop offset="0.48" stop-color="#ffffff" stop-opacity="0.88"/>
          <stop offset="1" stop-color="#111111" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
