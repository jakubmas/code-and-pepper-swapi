import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const isProduction = process.env.NODE_ENV === 'production';
const sslConfig = isProduction 
  ? { rejectUnauthorized: true } // Secure: verify SSL certificates in production
  : { rejectUnauthorized: false }; // Relaxed: allow self-signed certs in development

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
  ssl: sslConfig
});

async function verifyConnection(): Promise<void> {
  const maxRetries = 5;
  const retryDelay = 5000; 
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection verified');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${attempt}/${maxRetries} failed`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw error;
      }
    }
  }
}

verifyConnection().catch(err => {
  console.error('Failed to connect to database after retries:', err);
  process.exit(1);
});

pool.on('connect', () => {
  console.log('Database pool connected');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

export const db = drizzle(pool);

export { pool };

process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database pool closed');
  process.exit(0);
});