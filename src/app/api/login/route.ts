import 'reflect-metadata';
import { AuthController } from '@/lib/controller/auth.controller';
import { container } from '@/lib/diContainer';
import type { LoginRequestDto } from '@/lib/dtos/requests/loginRequest.dto';
import { LoginResponse } from '@/lib/dtos/response/loginRespose.dto';
import { InvalidPasswordError, UserNotFoundError } from '@/lib/errors/auth.error';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const authController = container.resolve(AuthController);
  const body = (await request.json()) as LoginRequestDto;
  try {
    const user = await authController.login(body.email, body.password);
    const response = new LoginResponse(200, 'success', { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    });
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      const response = new LoginResponse(404, 'User not found', 'User not found');
      return NextResponse.json(response, { status: 404 });
    } else if (err instanceof InvalidPasswordError) {
      const response = new LoginResponse(401, 'Invalid password', 'Invalid password');
      return NextResponse.json(response, { status: 401 });
    } else {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      const response = new LoginResponse(500, errorMessage, errorMessage);
      return NextResponse.json(response, { status: 500 });
    }
  }
};
