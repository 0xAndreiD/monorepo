/*
  Warnings:

  - Made the column `vendorId` on table `PortalDocument` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PortalDocument" DROP CONSTRAINT "PortalDocument_vendorId_fkey";

-- AlterTable
ALTER TABLE "PortalDocument" ALTER COLUMN "vendorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PortalDocument" ADD CONSTRAINT "PortalDocument_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
