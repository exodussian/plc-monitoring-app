import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  // Client-side authentication check
  useEffect(() => {
    // Check if we're in the browser
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Initialize local storage if needed
      if (localStorage.getItem('isLoggedIn') === null) {
        localStorage.setItem('isLoggedIn', 'false');
      }
      
      // Ensure user data is properly initialized
      if (localStorage.getItem('isLoggedIn') === 'true' && !localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>PLC Monitoring System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="PLC Monitoring System for industrial automation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Sadece client-side'da Layout'u render et */}
      {isClient ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px auto'
            }}></div>
            <div>Yükleniyor...</div>
          </div>
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default MyApp;