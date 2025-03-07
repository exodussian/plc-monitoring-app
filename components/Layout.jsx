import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        // localStorage sadece client tarafında çalışır
        if (typeof window !== 'undefined') {
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          setIsAuthenticated(isLoggedIn);
          
          // Login sayfasında değilsek ve giriş yapılmamışsa, login sayfasına yönlendir
          if (!isLoggedIn && router.pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        if (router.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);
  
  // Login sayfasında sidebar'ı gösterme
  if (router.pathname === '/login') {
    return <>{children}</>;
  }
  
  // Yükleme durumunda loading göster
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
        </div>
      </div>
    );
  }
  
  // Authentication kontrolü tamamlanana kadar içeriği gösterme
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f9fafb',
      overflow: 'hidden'
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflow: 'auto',
        padding: '24px'
      }}>
        {children}
      </main>
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
  );
};

export default Layout;