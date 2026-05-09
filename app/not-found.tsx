import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 pt-16 text-white">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-white/[0.03] text-sm font-semibold text-white">
            FSH
          </div>
        </div>
        <p className="mb-4 select-none text-7xl font-bold text-gray-800">404</p>
        <h1 className="mb-3 text-2xl font-bold text-white">Page not found</h1>
        <p className="mb-8 leading-relaxed text-gray-400">
          The page you are looking for does not exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/deals" className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-700 px-4 py-3 text-sm text-white hover:border-gray-500 sm:w-auto">
            <Search className="h-4 w-4" />
            Browse deals
          </Link>
          <Link href="/" className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 sm:w-auto">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
