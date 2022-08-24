/*
  Warnings:

  - Made the column `vendorId` on table `Link` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `MagicLink` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `ProductInfoSectionLink` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `Stakeholder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorTeamId` on table `Stakeholder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInfoSectionLink" DROP CONSTRAINT "ProductInfoSectionLink_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Stakeholder" DROP CONSTRAINT "Stakeholder_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Stakeholder" DROP CONSTRAINT "Stakeholder_vendorTeamId_fkey";

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MagicLink" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductInfoSectionLink" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stakeholder" ALTER COLUMN "vendorId" SET NOT NULL,
ALTER COLUMN "vendorTeamId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_vendorTeamId_fkey" FOREIGN KEY ("vendorTeamId") REFERENCES "VendorTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSectionLink" ADD CONSTRAINT "ProductInfoSectionLink_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
