import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
