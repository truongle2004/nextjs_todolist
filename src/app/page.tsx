'use client';

import { Button, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <Title level={2}>👋 Welcome to TodoList App</Title>
      <div className='flex gap-4 mt-6'>
        <Link href='/todo/login'>
          <Button type='primary'>Login</Button>
        </Link>
        <Link href='/todo/signup'>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
