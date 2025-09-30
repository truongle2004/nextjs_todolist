'use client';

import { login } from '@/apis/auth.api';
import { loginSchema } from '@/schema/loginSchema';
import type { LoginFormType } from '@/types/login.type';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { mutateAsync: loginMutation, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (response) => {
      // Extract user data from API response
      const userData = response.data;
      localStorage.setItem('user_id', userData.toLocaleString());

      // Redirect to dashboard
      router.push('/todo/dashboard');
    },
    onError: (error: any) => {
      if (error.response) {
        if (error.response.status === 404) {
          form.setFields([
            {
              name: 'email',
              errors: ['User not found. Please check your email.'],
            },
          ]);
        } else if (error.response.status === 401) {
          form.setFields([
            {
              name: 'password',
              errors: ['Invalid password. Please try again.'],
            },
          ]);
        } else {
          message.error(
            error.response.data.message || 'An unexpected error occurred.'
          );
        }
      } else {
        message.error('Login failed. Please check your credentials.');
      }
    },
  });

  const onFinish = async (values: LoginFormType) => {
    try {
      const validatedValues = loginSchema.parse(values);
      await loginMutation(validatedValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setFields(
          error.issues.map((issue) => ({
            name: issue.path.join('.'),
            errors: [issue.message],
          }))
        );
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all hover:shadow-xl p-12 sm:p-10'>
        <Form
          form={form}
          name='login_form'
          className='w-full'
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid Email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className='text-gray-400' />}
              placeholder='Email'
              size='large'
              className='rounded-md border-gray-300 focus:border-blue-500'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please input your Password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder='Password'
              size='large'
              className='rounded-md border-gray-300 focus:border-blue-500'
            />
          </Form.Item>
          <div className='flex justify-between items-center mb-4'>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox className='text-gray-600'>Remember me</Checkbox>
            </Form.Item>
            <a
              href='/forgot-password'
              className='text-blue-500 hover:text-blue-700 text-sm'
            >
              Forgot Password?
            </a>
          </div>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              loading={isPending}
              icon={<LoginOutlined />}
              className='w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-md text-white font-semibold transition-colors duration-300'
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Text className='mt-6 text-gray-600'>
        Don&apos;t have an account?{' '}
        <a
          href='/todo/signup'
          className='text-blue-500 hover:text-blue-700 font-medium'
        >
          Sign up
        </a>
      </Text>
    </div>
  );
};

export default Login;
