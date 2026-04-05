import { redirect } from 'next/navigation';

// Admin auth removed — redirect to home
export default function AuthLayout() {
  redirect('/home');
}
