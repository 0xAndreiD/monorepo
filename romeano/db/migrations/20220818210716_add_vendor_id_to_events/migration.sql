-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "Stakeholder" ADD COLUMN     "vendorTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_vendorTeamId_fkey" FOREIGN KEY ("vendorTeamId") REFERENCES "VendorTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
