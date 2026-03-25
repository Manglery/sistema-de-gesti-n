/**
 * Application Hono environment type.
 *
 * Use AppEnv for ALL Hono instances and route handlers in the worker/ directory.
 *
 * Usage:
 *   import type { AppEnv } from './types/app-env';
 *   const app = new Hono<AppEnv>();
 *   const routes = new Hono<AppEnv>();
 *
 * Context variables (c.get/c.set) are typed via Variables.
 * Add explicit entries for better type safety:
 *
 *   type AuthEnv = {
 *     Bindings: Env;
 *     Variables: AppEnv['Variables'] & { user: User; session: SessionData };
 *   };
 */

/** Re-export Cloudflare Worker bindings from core-utils */
export type { Env } from '../core-utils';

/**
 * Hono app environment -- generic parameter for all Hono instances.
 *
 * Variables uses Record<string, unknown> so c.get('key') compiles for any key.
 * Cast the return value for type safety: const user = c.get('user') as User;
 */
export type AppEnv = {
  Bindings: import('../core-utils').Env;
  Variables: Record<string, unknown>;
};
