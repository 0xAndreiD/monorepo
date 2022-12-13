/*
  Warnings:

  - You are about to drop the column `isGlobal` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portal" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "isGlobal";
