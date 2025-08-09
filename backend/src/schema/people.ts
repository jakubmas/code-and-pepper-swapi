import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  height: integer('height'),
  mass: integer('mass').notNull(),
  hairColor: text('hair_color'),
  skinColor: text('skin_color'),
  eyeColor: text('eye_color'),
  birthYear: text('birth_year'),
  gender: text('gender'),
  created: timestamp('created').defaultNow(),
  edited: timestamp('edited').defaultNow(),
});

export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;