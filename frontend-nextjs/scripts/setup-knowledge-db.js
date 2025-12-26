const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Zszhpq1oLul5@ep-summer-waterfall-adtkjudj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

async function setup() {
    try {
        console.log("Creating table 'knowledge_docs'...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS knowledge_docs (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL, -- 'text', 'url', 'file'
        content TEXT, -- content or url
        size TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active'
      );
    `);
        console.log("Table 'knowledge_docs' created successfully.");
    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        await pool.end();
    }
}

setup();
