import { NextRequest, NextResponse } from 'next/server';

function getInitials(name: string, shortName?: string | null, logoText?: string | null) {
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
  const initials = getInitials(name, shortName, logoText);
  const label = shortName || name;

  const safeBrand = /^#[0-9A-Fa-f]{3,8}$/.test(brand) ? brand : '#111111';
  const safeName = name.replace(/[<&>"]/g, '');
  const safeLabel = label.replace(/[<&>"]/g, '');
  const safeInitials = initials.replace(/[<&>"]/g, '');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="40" fill="#050505"/>
      <rect x="8" y="8" width="224" height="224" rx="32" fill="${safeBrand}" fill-opacity="0.18" stroke="rgba(255,255,255,0.14)"/>
      <circle cx="120" cy="84" r="44" fill="${safeBrand}" fill-opacity="0.95"/>
      <text x="120" y="96" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff" letter-spacing="4">${safeInitials}</text>
      <text x="120" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="2">${safeLabel.slice(0, 18).toUpperCase()}</text>
      <text x="120" y="182" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="400" fill="rgba(255,255,255,0.65)">${safeName.slice(0, 28)}</text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
