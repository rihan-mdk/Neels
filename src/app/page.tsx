import { redirect } from 'next/navigation';

// Root: redirect users to the intro/login experience
export default function RootPage() {
  redirect('/intro');
}

