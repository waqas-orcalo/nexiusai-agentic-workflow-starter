'use client';
import AuthGuard from '@/GuardsAndPermissions/AuthGuard';
import MainLayout from '@/layout/MainLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
