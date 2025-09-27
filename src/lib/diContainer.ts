import { container } from 'tsyringe';
import { TodoDbImpl } from './db/impl/todo.db.impl';
import { SupabaseServiceImpl } from './services/impl/supabase.service.impl';
import { TodoServiceImpl } from './services/impl/todo.service.impl';
import { AuthServiceImpl } from './services/impl/auth.service.impl';
import { AuthDbImpl } from './db/impl/auth.db.impl';

container.register('IAuthService', { useClass: AuthServiceImpl });
container.register('IAuthDb', { useClass: AuthDbImpl });
container.register('ITodoService', { useClass: TodoServiceImpl });
container.register('ITodoDb', { useClass: TodoDbImpl });
container.register('ISupabaseService', { useClass: SupabaseServiceImpl });

export { container };
