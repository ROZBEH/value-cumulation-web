/*
  Warnings:

  - You are about to drop the `Metric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Metric" DROP CONSTRAINT "Metric_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteMetrics" TEXT[];

-- DropTable
DROP TABLE "Metric";
