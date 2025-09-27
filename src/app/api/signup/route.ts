import 'reflect-metadata';
import { AuthController } from '@/lib/controller/auth.controller';
import { container } from '@/lib/diContainer';
import type { SignupFormType } from '@/types/register.type';
import { NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';

export const POST = async (request: Request) => {
  const authController = container.resolve(AuthController);
  const body = (await request.json()) as SignupFormType;
  try {
    await authController.signup(body);
    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (err) {
    if (err instanceof PostgrestError && err.code === '23505') {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};
