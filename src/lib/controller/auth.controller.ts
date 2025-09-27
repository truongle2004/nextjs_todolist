import { inject, injectable } from 'tsyringe';
import type { SignupFormType } from '@/types/register.type';
import type { User } from '@/types';
import type { IAuthService } from '../services/auth.service';

@injectable()
export class AuthController {
  constructor(
    @inject('IAuthService') private readonly authService: IAuthService
  ) {}

  async login(email: string, password: string): Promise<User> {
    return await this.authService.login(email, password);
  }

  async signup(data: SignupFormType): Promise<void> {
    await this.authService.signup(data);
  }
}
