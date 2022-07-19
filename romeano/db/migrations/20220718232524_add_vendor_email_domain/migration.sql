/*
  Warnings:

  - A unique constraint covering the columns `[emailDomain]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "emailDomain" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_emailDomain_key" ON "Vendor"("emailDomain");
