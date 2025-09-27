import type { SignupFormType } from '@/types/register.type';
import type { User } from '@/types';

export interface IAuthDb {
  login: (email: string) => Promise<User | null>;
  signup(data: SignupFormType): Promise<User | null>;
  logout: () => Promise<void>;
}
