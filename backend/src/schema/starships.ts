import { pgTable, serial, text, integer, decimal, timestamp, bigint } from 'drizzle-orm/pg-core';

export const starships = pgTable('starships', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  model: text('model'),
  manufacturer: text('manufacturer'),
  costInCredits: bigint('cost_in_credits', { mode: 'number' }), 
  length: decimal('length', { precision: 10, scale: 2 }), 
  maxAtmospheringSpeed: integer('max_atmosphering_speed'),
  crew: integer('crew').notNull(), 
  passengers: integer('passengers'),
  cargoCapacity: bigint('cargo_capacity', { mode: 'number' }), 
  consumables: text('consumables'),
  hyperdriveRating: decimal('hyperdrive_rating', { precision: 3, scale: 1 }),
  MGLT: integer('mglt'),
  starshipClass: text('starship_class'),
  created: timestamp('created').defaultNow(),
  edited: timestamp('edited').defaultNow(),
});

export type Starship = typeof starships.$inferSelect;
export type NewStarship = typeof starships.$inferInsert;