import { redirect } from 'next/navigation';

// Admin dashboard removed — redirect all dashboard routes to home
export default function DashboardLayout() {
  redirect('/home');
}
