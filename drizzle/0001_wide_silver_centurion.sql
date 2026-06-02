ALTER TABLE "session_chat" DROP CONSTRAINT "session_chat_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session_chat" ALTER COLUMN "session_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "session_chat" ALTER COLUMN "createdBy" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "session_chat" ALTER COLUMN "createdBy" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "session_chat" ALTER COLUMN "createdOn" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "creadits" integer;--> statement-breakpoint
ALTER TABLE "session_chat" ADD CONSTRAINT "session_chat_createdBy_users_email_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_chat" DROP COLUMN "allSuggestions";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "credits";