import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Kullanıcı bilgilerini localStorage'dan al
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username || 'Kullanıcı');
      }
    } catch (error) {
      console.error('User data retrieval error:', error);
    }
  }, []);
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Services', path: '/services', icon: '🔧' }
  ];
  
  const handleLogout = () => {
    try {
      // Çıkış işlemi
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('user');
      
      // Kullanıcıyı login sayfasına yönlendir
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile login sayfasına yönlendir
      router.push('/login');
    }
  };
  
  const isActive = (path) => router.pathname === path;
  
  // Stil tanımları
  const styles = {
    sidebar: {
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      width: collapsed ? '80px' : '250px',
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    },
    logoImage: {
      width: collapsed ? '60px' : '200px',
      height: 'auto',
      objectFit: 'contain',
      marginBottom: '8px'
    },
    toggleButton: {
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      marginTop: '8px',
      color: '#6b7280',
      fontSize: '16px'
    },
    menu: {
      padding: '16px 0',
      flex: 1,
      overflowY: 'auto'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#374151',
      marginBottom: '4px',
      borderRadius: '4px',
      margin: '0 8px'
    },
    activeMenuItem: {
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
      fontWeight: '500'
    },
    menuIcon: {
      marginRight: collapsed ? '0' : '12px',
      fontSize: '18px'
    },
    menuText: {
      display: collapsed ? 'none' : 'block'
    },
    footer: {
      borderTop: '1px solid #e5e7eb',
      padding: '16px'
    },
    userInfo: {
      display: collapsed ? 'none' : 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6b7280'
    },
    userAvatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '8px',
      fontSize: '12px'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      padding: '8px 16px',
      cursor: 'pointer',
      color: '#374151',
      width: '100%',
      textAlign: 'left',
      borderRadius: '4px',
      margin: '0 8px',
      transition: 'background-color 0.2s'
    },
    logoutButtonHover: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
    }
  };
  
  // Hover efekti için state
  const [logoutHover, setLogoutHover] = useState(false);
  
  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src="/logo.jpg" 
            alt="GAWRONSKI Logo" 
            style={styles.logoImage}
          />
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggleButton}
          title={collapsed ? "Genişlet" : "Daralt"}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <div style={styles.menu}>
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path} passHref>
                <div
                  style={{
                    ...styles.menuItem,
                    ...(isActive(item.path) ? styles.activeMenuItem : {})
                  }}
                  title={collapsed ? item.name : ''}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  <span style={styles.menuText}>{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={styles.footer}>
        {username && (
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span>{username}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            ...styles.logoutButton,
            ...(logoutHover ? styles.logoutButtonHover : {})
          }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          title={collapsed ? "Çıkış Yap" : ""}
        >
          <span style={styles.menuIcon}>🚪</span>
          <span style={styles.menuText}>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;