import type { loginSchema } from '@/schema/loginSchema';
import type z from 'zod';

export type LoginFormType = z.infer<typeof loginSchema>;
