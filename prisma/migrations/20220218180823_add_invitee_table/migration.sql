/*
  Warnings:

  - Added the required column `invitee_id` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "invitee_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organization_id" INTEGER;

-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "event_duration" INTEGER;

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitees" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_uuid_key" ON "organizations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_legal_name_key" ON "organizations"("legal_name");

-- CreateIndex
CREATE UNIQUE INDEX "invitees_uuid_key" ON "invitees"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "invitees_email_key" ON "invitees"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "invitees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
