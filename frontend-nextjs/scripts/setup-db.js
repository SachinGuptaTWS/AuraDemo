const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Zszhpq1oLul5@ep-summer-waterfall-adtkjudj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

async function setup() {
    try {
        console.log("Connecting to Neon Postgres...");
        await pool.query('SELECT NOW()'); // Test connection

        console.log("Creating table 'agents'...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        stats JSONB DEFAULT '{}'
      );
    `);
        console.log("Table 'agents' created successfully.");
    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        await pool.end();
    }
}

setup();
