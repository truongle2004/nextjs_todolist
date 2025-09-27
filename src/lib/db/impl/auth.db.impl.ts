import { logger } from '@/configs/logger.config';
import type { ISupabaseService } from '@/lib/services/supabase.service';
import type { SignupFormType } from '@/types/register.type';
import type { User } from '@/types';
import { inject, injectable } from 'tsyringe';
import type { IAuthDb } from '../auth.db';

@injectable()
export class AuthDbImpl implements IAuthDb {
  private USER_TABLE = 'users';
  constructor(
    @inject('ISupabaseService')
    private readonly supabaseService: ISupabaseService
  ) {}
  async signup(data: SignupFormType): Promise<User | null> {
    const supabase = await this.supabaseService.getClient();
    const { data: user, error } = await supabase
      .from(this.USER_TABLE)
      .insert([{
        username: data.username,
        email: data.email,
        password: data.password,
      }])
      .select();

    if (error) {
      logger.error('Error creating user at auth.db.impl.ts :', error);
      throw error;
    }

    if (!user || user.length === 0) {
      return null;
    }

    return user[0] as User;
  }

  async logout(): Promise<void> {}

  async login(email: string): Promise<User | null> {
    const supabase = await this.supabaseService.getClient();
    const { data, error } = await supabase
      .from(this.USER_TABLE)
      .select('*')
      .eq('email', email);

    if (error) {
      logger.error('Error fetching user at auth.db.impl.ts :', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const user = data[0] as User;
    return user;
  }
}
