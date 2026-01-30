import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ItemsPage } from './components/ItemsPage';
import { UsersPage } from './components/UsersPage';
import { MovementsPage } from './components/MovementsPage';
import { ReportsPage } from './components/ReportsPage';
import { GlobalLoading } from './components/GlobalLoading';
import { Toaster } from './components/ui/sonner';
import { login, logout, getCurrentUser } from './services/auth';
import type { AuthUser } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      setCurrentUser(null);
      setCurrentPage('dashboard');
      setLoginError('');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const handleLogin = async (email: string, senha: string) => {
    setLoginError('');
    try {
      const user = await login({ email, senha });
      if (user) {
        setCurrentUser(user);
      } else {
        setLoginError('Email ou senha inválidos');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Erro ao realizar login');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} error={loginError} />
        <Toaster position="top-right" />
        <GlobalLoading />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'items':
        return <ItemsPage />;
      case 'users':
        return <UsersPage />;
      case 'movements':
        return <MovementsPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">{renderPage()}</main>

      <Toaster position="top-right" />
      <GlobalLoading />
    </div>
  );
}
