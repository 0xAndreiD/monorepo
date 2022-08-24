-- DropForeignKey
ALTER TABLE "Stakeholder" DROP CONSTRAINT "Stakeholder_vendorTeamId_fkey";

-- AlterTable
ALTER TABLE "Stakeholder" ALTER COLUMN "vendorTeamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_vendorTeamId_fkey" FOREIGN KEY ("vendorTeamId") REFERENCES "VendorTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
