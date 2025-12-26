import { Pool } from 'pg';

const connectionString = "postgresql://neondb_owner:npg_Zszhpq1oLul5@ep-summer-waterfall-adtkjudj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Use a global variable to preserve the pool across hot reloads in development
const globalForPg = global as unknown as { pgPool: Pool };

export const pool = globalForPg.pgPool || new Pool({
    connectionString,
});

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export default pool;
