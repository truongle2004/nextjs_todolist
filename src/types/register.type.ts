import type { signupSchema } from '@/schema/registerSchema';
import type z from 'zod';

export type SignupFormType = z.infer<typeof signupSchema>;
