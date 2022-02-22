/*
  Warnings:

  - Made the column `event_duration` on table `event_types` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event_types" ALTER COLUMN "event_duration" SET NOT NULL;

-- CreateTable
CREATE TABLE "blacklists" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklists_uuid_key" ON "blacklists"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "blacklists_hash_key" ON "blacklists"("hash");
