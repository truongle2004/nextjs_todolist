'use client';
import useAuthStore from '@/store/authStore';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const handleSignup = () => {
    router.push('/todo/signup');
  };

  return (
    <header className='flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b'>
      <h1 className='text-xl font-semibold flex items-center gap-2'>
        📝 Todo List
      </h1>
      {isLoggedIn() ? (
        <Button type='primary' onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button type='primary' onClick={handleSignup}>
          Signup
        </Button>
      )}
    </header>
  );
};

export default Header;
