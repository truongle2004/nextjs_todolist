import type { loginSchema } from '@/scheme/loginScheme';
import type z from 'zod';

export type LoginFormType = z.infer<typeof loginSchema>;
