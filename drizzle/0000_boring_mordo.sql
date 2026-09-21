CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"idea" text NOT NULL,
	"addons" text NOT NULL,
	"estimate" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"consent_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expires_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_inquiries_created" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_inquiries_status_created" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_limits_expiry" ON "request_limits" USING btree ("expires_at");