import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('easyauth_token');

  if (token) {
    redirect('/app');
  } else {
    redirect('/signin');
  }
}
