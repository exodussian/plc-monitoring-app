import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Login | PLC Monitoring System</title>
        <meta name="description" content="Login to the PLC Monitoring System" />
      </Head>
      <LoginForm />
    </>
  );
}