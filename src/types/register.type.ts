import type { signupSchema } from '@/scheme/registerScheme';
import type z from 'zod';

export type SignupFormType = z.infer<typeof signupSchema>;
