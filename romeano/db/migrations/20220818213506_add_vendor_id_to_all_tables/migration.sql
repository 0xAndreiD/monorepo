-- AlterTable
ALTER TABLE "InternalNote" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "NextStepsTask" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "PortalDocument" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "PortalImage" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "ProductInfoSection" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "ProductInfoSectionLink" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "RoadmapStage" ADD COLUMN     "vendorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSection" ADD CONSTRAINT "ProductInfoSection_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSectionLink" ADD CONSTRAINT "ProductInfoSectionLink_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalImage" ADD CONSTRAINT "PortalImage_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStage" ADD CONSTRAINT "RoadmapStage_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextStepsTask" ADD CONSTRAINT "NextStepsTask_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalDocument" ADD CONSTRAINT "PortalDocument_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
