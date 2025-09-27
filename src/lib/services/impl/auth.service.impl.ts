import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import type { IAuthService } from '../auth.service';
import type { IAuthDb } from '@/lib/db/auth.db';
import { PostgrestError } from '@supabase/supabase-js';
import { logger } from '@/configs/logger.config';
import { InvalidPasswordError, UserNotFoundError } from '@/lib/errors/auth.error';
import type { SignupFormType } from '@/types/register.type';
import type { User } from '@/types';

@injectable()
export class AuthServiceImpl implements IAuthService {
  constructor(@inject('IAuthDb') private readonly authDb: IAuthDb) {}

  async login(email: string, password: string): Promise<User> {
    const user = await this.authDb.login(email);

    if (user === null) {
      throw new UserNotFoundError('User not found');
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new InvalidPasswordError('Invalid password');
      }
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
  }

  async signup(data: SignupFormType): Promise<void> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.authDb.signup({ ...data, password: hashedPassword });
  }
}
