import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  void children;
  redirect('/dashboard');
}
