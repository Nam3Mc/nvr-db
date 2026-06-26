/*
  Warnings:

  - You are about to drop the column `url` on the `ServicePhoto` table. All the data in the column will be lost.
  - Added the required column `PublicId` to the `ServicePhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Url` to the `ServicePhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServicePhoto" DROP COLUMN "url",
ADD COLUMN     "PublicId" TEXT NOT NULL,
ADD COLUMN     "Url" TEXT NOT NULL;
