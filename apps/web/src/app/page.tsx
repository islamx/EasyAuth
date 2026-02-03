import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('easyauth_token');

  if (token) {
    redirect('/app');
  } else {
    redirect('/signin');
  }
}
