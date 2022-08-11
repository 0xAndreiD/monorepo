-- DropForeignKey
ALTER TABLE "Portal" DROP CONSTRAINT "Portal_vendorId_fkey";

-- AlterTable
ALTER TABLE "AccountExecutive" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "Portal" ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "vendorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "UserPortal" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "VendorTeam" ADD COLUMN     "name" TEXT;

-- AddForeignKey
ALTER TABLE "Portal" ADD CONSTRAINT "Portal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portal" ADD CONSTRAINT "Portal_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPortal" ADD CONSTRAINT "UserPortal_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountExecutive" ADD CONSTRAINT "AccountExecutive_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
