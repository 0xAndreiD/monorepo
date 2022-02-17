-- AlterTable
ALTER TABLE "InternalNote" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "NextStepsTask" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "PortalDocument" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "PortalImage" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "ProductInfoSection" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "RoadmapStage" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "UserPortal" ADD COLUMN     "templateId" INTEGER;

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "proposalHeading" TEXT NOT NULL,
    "proposalSubheading" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPortal" ADD CONSTRAINT "UserPortal_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSection" ADD CONSTRAINT "ProductInfoSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalImage" ADD CONSTRAINT "PortalImage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStage" ADD CONSTRAINT "RoadmapStage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextStepsTask" ADD CONSTRAINT "NextStepsTask_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalDocument" ADD CONSTRAINT "PortalDocument_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
