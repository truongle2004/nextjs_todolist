'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/todo/login');
  };

  const handleLogin = () => {
    router.push('/todo/login');
  };

  const handleRouteDashboard = () => {
    router.push('/todo/dashboard');
  };

  const handleRoutePokemon = () => {
    router.push('/pokemon');
  };

  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      router.push('/todo/login');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <header className='flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b'>
      <h1 className='text-xl font-semibold flex items-center gap-2'>
        📝 Todo List
      </h1>
      {isAuthenticated ? (
        <div className='flex gap-2'>
          <Button type='primary' onClick={handleRoutePokemon}>
            Pokemon
          </Button>
          <Button type='primary' onClick={handleRouteDashboard}>
            Dashboard
          </Button>
          <Button type='primary' onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Button type='primary' onClick={handleLogin}>
          Login
        </Button>
      )}
    </header>
  );
};

export default Header;
