CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"height" integer,
	"mass" integer NOT NULL,
	"hair_color" text,
	"skin_color" text,
	"eye_color" text,
	"birth_year" text,
	"gender" text,
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now(),
	CONSTRAINT "people_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "starships" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"model" text,
	"manufacturer" text,
	"cost_in_credits" bigint,
	"length" numeric(10, 2),
	"max_atmosphering_speed" integer,
	"crew" integer NOT NULL,
	"passengers" integer,
	"cargo_capacity" bigint,
	"consumables" text,
	"hyperdrive_rating" numeric(3, 1),
	"mglt" integer,
	"starship_class" text,
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now(),
	CONSTRAINT "starships_name_unique" UNIQUE("name")
);
