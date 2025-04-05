CREATE TYPE "public"."gpu_manufacturer" AS ENUM('nvidia', 'amd', 'intel');--> statement-breakpoint
CREATE TYPE "public"."currencies" AS ENUM('EUR', 'USD', 'JYP', 'GBP', 'AUD', 'CAD', 'CHF', 'CNH', 'SEK', 'NZD');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brands_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name"),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "components" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "components_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"category_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"gpu_model_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "components_name_unique" UNIQUE("name"),
	CONSTRAINT "components_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gpu_models" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gpu_models_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"manufacturer" "gpu_manufacturer" NOT NULL,
	CONSTRAINT "gpu_models_name_unique" UNIQUE("name"),
	CONSTRAINT "gpu_models_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"component_id" integer NOT NULL,
	"price" real NOT NULL,
	"currency" "currencies" DEFAULT 'EUR' NOT NULL,
	"vendor_id" integer NOT NULL,
	"url" varchar NOT NULL,
	"scraped_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"website" varchar NOT NULL,
	CONSTRAINT "vendors_name_unique" UNIQUE("name"),
	CONSTRAINT "vendors_slug_unique" UNIQUE("slug"),
	CONSTRAINT "vendors_website_unique" UNIQUE("website")
);
--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_gpu_model_id_gpu_models_id_fk" FOREIGN KEY ("gpu_model_id") REFERENCES "public"."gpu_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_search_english_index" ON "components" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "scraped_at_idx" ON "prices" USING btree ("scraped_at");