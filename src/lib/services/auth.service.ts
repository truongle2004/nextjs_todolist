import type { SignupFormType } from '@/types/register.type';

import type { User } from '@/types';

export interface IAuthService {
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupFormType) => Promise<void>;
  // logout: () => Promise<void>;
}
