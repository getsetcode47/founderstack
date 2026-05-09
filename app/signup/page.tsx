import { redirect } from 'next/navigation';

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();
  params.set('mode', 'signup');

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (!value || key === 'mode') continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else {
      params.set(key, value);
    }
  }

  redirect(`/sign-in?${params.toString()}`);
}
