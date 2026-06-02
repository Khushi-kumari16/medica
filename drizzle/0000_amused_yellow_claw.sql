CREATE TABLE "session_chat" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "session_chat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"session_id" varchar(255) NOT NULL,
	"notes" text,
	"conversation" json,
	"report" json,
	"selectedDoctor" json,
	"allSuggestions" json,
	"createdBy" varchar(255) NOT NULL,
	"createdOn" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "session_chat" ADD CONSTRAINT "session_chat_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;