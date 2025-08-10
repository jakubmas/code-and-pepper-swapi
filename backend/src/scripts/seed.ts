import { db, pool } from '../config/database';
import { people, starships } from '../schema';
import { peopleSeedData, starshipsSeedData } from '../data/seed-data';

async function seed(): Promise<void> {
  console.log('Starting seed process...');

  try {
    console.log('Dropping data...');
    await db.delete(people);
    await db.delete(starships);

    console.log('🧑‍🚀 Inserting people...');
    const insertedPeople = await db.insert(people).values(peopleSeedData).returning();
    console.log(`Inserted ${insertedPeople.length} people`);

    console.log('🚀 Inserting starships...');
    const insertedStarships = await db.insert(starships).values(starshipsSeedData).returning();
    console.log(`Inserted ${insertedStarships.length} starships`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n✅ Seed completed successfully!');
  }
}

seed();
