import { pgTable, serial, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const battles = pgTable('battles', {
  id: serial('id').primaryKey(),
  winner: text('winner', { enum: ['player', 'computer', 'draw'] }).notNull(),
  resourceType: text('resource_type', { enum: ['people', 'starships'] }).notNull(),
  players: jsonb('players').notNull().$type<Array<{
    id: number;
    name: string;
    value: string;
  }>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    createdAtIdx: index('battles_created_at_idx').on(table.createdAt),
    winnerIdx: index('battles_winner_idx').on(table.winner),
    resourceTypeIdx: index('battles_resource_type_idx').on(table.resourceType),
  };
});

export type Battle = typeof battles.$inferSelect;
export type NewBattle = typeof battles.$inferInsert;