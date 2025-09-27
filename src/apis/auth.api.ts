import type { LoginFormType } from '@/types/login.type';
import type { SignupFormType } from '@/types/register.type';
import axiosInstance from '@/utils/axiosInstance';

export const login = async (form: LoginFormType) => {
  return await axiosInstance.post('/api/login', form);
};

export const signup = async (form: SignupFormType) => {
  return await axiosInstance.post('/api/signup', form);
};
