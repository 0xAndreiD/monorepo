/*
  Warnings:

  - A unique constraint covering the columns `[email,vendorId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_vendorId_key" ON "User"("email", "vendorId");
