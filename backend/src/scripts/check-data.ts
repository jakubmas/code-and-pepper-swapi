import { db, pool } from '../config/database';
import { sql } from 'drizzle-orm';

// TODO: Added for testing purpose only - remove later also from package.json
async function checkData() {
  try {
    const randomPerson = await db.execute(sql`
      SELECT name, mass FROM people ORDER BY RANDOM() LIMIT 3
    `);
    const randomStarship = await db.execute(sql`
      SELECT name, crew FROM starships ORDER BY RANDOM() LIMIT 3
    `);

    console.log('Random people:', randomPerson.rows);
    console.log('Random starships:', randomStarship.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkData();
