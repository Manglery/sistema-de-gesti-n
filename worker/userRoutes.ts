import { Hono } from "hono";
import type { AppEnv } from './types/app-env';

export function userRoutes(app: Hono<AppEnv>) {
    // Add more routes like this. **DO NOT MODIFY CORS OR OVERRIDE ERROR HANDLERS**
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
}
