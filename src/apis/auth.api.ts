import type { ApiResponse } from '@/types/apiResponse.type';
import type { LoginFormType } from '@/types/login.type';
import type { SignupFormType } from '@/types/register.type';
import axiosInstance from '@/utils/axiosInstance';

export const login = async (
  form: LoginFormType
): Promise<ApiResponse<number>> => {
  return await axiosInstance.post('/login', form);
};

export const signup = async (form: SignupFormType) => {
  return await axiosInstance.post('/signup', form);
};
