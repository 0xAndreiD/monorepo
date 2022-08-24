/*
  Warnings:

  - Made the column `vendorId` on table `AccountExecutive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `InternalNote` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `NextStepsTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `PortalImage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `ProductInfoSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `RoadmapStage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `Template` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `UserPortal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AccountExecutive" DROP CONSTRAINT "AccountExecutive_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "InternalNote" DROP CONSTRAINT "InternalNote_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "NextStepsTask" DROP CONSTRAINT "NextStepsTask_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "PortalImage" DROP CONSTRAINT "PortalImage_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInfoSection" DROP CONSTRAINT "ProductInfoSection_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapStage" DROP CONSTRAINT "RoadmapStage_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "UserPortal" DROP CONSTRAINT "UserPortal_vendorId_fkey";

-- AlterTable
ALTER TABLE "AccountExecutive" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "InternalNote" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "NextStepsTask" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PortalImage" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductInfoSection" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RoadmapStage" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserPortal" ALTER COLUMN "vendorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPortal" ADD CONSTRAINT "UserPortal_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountExecutive" ADD CONSTRAINT "AccountExecutive_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSection" ADD CONSTRAINT "ProductInfoSection_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalImage" ADD CONSTRAINT "PortalImage_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStage" ADD CONSTRAINT "RoadmapStage_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextStepsTask" ADD CONSTRAINT "NextStepsTask_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
