import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Gerçek bir API'ye bağlanacak şekilde düzenlenebilir
      // Şimdilik basit bir kontrol yapıyoruz
      if (username === 'admin' && password === 'admin') {
        // Başarılı giriş
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        
        // Kısa bir gecikme ekleyerek loading durumunu gösterelim
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setError('Geçersiz kullanıcı adı veya şifre');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  // Stil tanımları
  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    },
    formCard: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '32px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    buttonContainer: {
      marginTop: '24px'
    },
    button: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonDisabled: {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
    },
    spinner: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTop: '2px solid #fff',
      width: '16px',
      height: '16px',
      marginRight: '8px',
      animation: 'spin 1s linear infinite'
    },
    demoCredentials: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>PLC Monitoring System</h1>
          <p style={styles.subtitle}>Login to access the dashboard</p>
        </div>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              type="submit"
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
              disabled={isLoading}
            >
              {isLoading && (
                <div style={styles.spinner}></div>
              )}
              {isLoading ? 'Giriş yapılıyor...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div style={styles.demoCredentials}>
          Demo credentials: admin / admin
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;