/*
  Warnings:

  - You are about to drop the column `PublicId` on the `ServicePhoto` table. All the data in the column will be lost.
  - You are about to drop the column `Url` on the `ServicePhoto` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `ServicePhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ServicePhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "measurementUnit" SET DEFAULT 'LITER';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "ServicePhoto" DROP COLUMN "PublicId",
DROP COLUMN "Url",
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
