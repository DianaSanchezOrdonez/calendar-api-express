/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `event_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "event_types_name_key" ON "event_types"("name");
