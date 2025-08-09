CREATE TABLE "battles" (
	"id" serial PRIMARY KEY NOT NULL,
	"winner" text NOT NULL,
	"resource_type" text NOT NULL,
	"players" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "battles_created_at_idx" ON "battles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "battles_winner_idx" ON "battles" USING btree ("winner");--> statement-breakpoint
CREATE INDEX "battles_resource_type_idx" ON "battles" USING btree ("resource_type");