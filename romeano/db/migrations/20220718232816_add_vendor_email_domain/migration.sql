-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "emailDomain" SET DEFAULT gen_random_uuid();
