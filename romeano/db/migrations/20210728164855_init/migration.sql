/*
  Warnings:

  - You are about to drop the column `portalId` on the `MagicLink` table. All the data in the column will be lost.
  - Added the required column `url` to the `MagicLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MagicLink" DROP CONSTRAINT "MagicLink_userId_portalId_fkey";

-- AlterTable
ALTER TABLE "MagicLink" DROP COLUMN "portalId",
ADD COLUMN     "url" TEXT NOT NULL;
