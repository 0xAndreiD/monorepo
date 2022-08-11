/*
  Warnings:

  - Made the column `vendorId` on table `Portal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Portal" DROP CONSTRAINT "Portal_vendorId_fkey";

-- AlterTable
ALTER TABLE "Portal" ALTER COLUMN "vendorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Portal" ADD CONSTRAINT "Portal_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
