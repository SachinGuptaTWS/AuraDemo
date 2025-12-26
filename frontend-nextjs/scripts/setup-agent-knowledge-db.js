const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Zszhpq1oLul5@ep-summer-waterfall-adtkjudj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

async function setup() {
    try {
        console.log("Creating table 'agent_knowledge'...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_knowledge (
        agent_id UUID NOT NULL,
        doc_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (agent_id, doc_id)
      );
    `);
        console.log("Table 'agent_knowledge' created successfully.");
    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        await pool.end();
    }
}

setup();
