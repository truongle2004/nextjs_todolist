import { injectable, singleton } from 'tsyringe';
import type { ISupabaseService } from '../supabase.service';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

@injectable()
@singleton()
export class SupabaseServiceImpl implements ISupabaseService {
  async getClient(): Promise<SupabaseClient> {
    return createClient();
  }
}
