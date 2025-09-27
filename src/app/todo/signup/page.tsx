'use client';

import { signup } from '@/apis/auth.api';
import { signupSchema } from '@/scheme/registerScheme';
import type { SignupFormType } from '@/types/register.type';
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { z } from 'zod';

const { Title, Text } = Typography;

const Signup: React.FC = () => {
  const [form] = Form.useForm();

  const {
    mutateAsync: signupMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onError: (error: any) => {
      if (error.response && error.response.status === 409) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email already exists. Please use a different email.'],
          },
        ]);
      } else {
        message.error('Registration failed. Please try again.');
      }
    },
  });

  const onFinish = async (values: SignupFormType) => {
    try {
      const validatedValues = signupSchema.parse(values);
      await signupMutation(validatedValues);
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

  if (isSuccess) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6'>
        <div className='w-full max-w-md bg-white rounded-xl shadow-2xl p-12 sm:p-10 text-center'>
          <Title level={2} className='text-gray-800 font-bold mb-4'>
            Registration Successful!
          </Title>
          <Text className='text-gray-600 mb-6'>
            Your account has been created successfully.
          </Text>
          <Button
            type='primary'
            size='large'
            onClick={() => (window.location.href = '/todo/login')}
            className='w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-md text-white font-semibold transition-colors duration-300'
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6'>
      <div className='mb-6 flex flex-col items-center'>
        <Title level={2} className='text-gray-800 font-bold'>
          Create Account
        </Title>
        <Text className='text-gray-600'>Sign up to get started</Text>
      </div>
      <div className='w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all hover:shadow-xl p-12 sm:p-10'>
        <Form
          form={form}
          name='signup_form'
          className='w-full'
          initialValues={{ agree: false }}
          onFinish={onFinish}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className='text-gray-400' />}
              placeholder='Username'
              size='large'
              className='rounded-md border-gray-300 focus:border-blue-500'
            />
          </Form.Item>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid Email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className='text-gray-400' />}
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
          <Form.Item
            name='confirmPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your Password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder='Confirm Password'
              size='large'
              className='rounded-md border-gray-300 focus:border-blue-500'
            />
          </Form.Item>
          <div className='flex justify-between items-center mb-4'>
            <Form.Item name='agree' valuePropName='checked' noStyle>
              <Checkbox className='text-gray-600'>
                I agree to the terms and conditions
              </Checkbox>
            </Form.Item>
          </div>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.agree !== currentValues.agree
            }
          >
            {({ getFieldValue }) => (
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={isPending}
                icon={<LoginOutlined />}
                disabled={!getFieldValue('agree')}
                className='w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-md text-white font-semibold transition-colors duration-300'
              >
                {isPending ? 'Signing up...' : 'Sign up'}
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
      <Text className='mt-6 text-gray-600'>
        Already have an account?{' '}
        <a
          href='/todo/login'
          className='text-blue-500 hover:text-blue-700 font-medium'
        >
          Log in
        </a>
      </Text>
    </div>
  );
};

export default Signup;
