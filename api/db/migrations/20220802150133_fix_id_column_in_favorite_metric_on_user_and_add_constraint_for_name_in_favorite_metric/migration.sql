/*
  Warnings:

  - The primary key for the `FavoriteMetricOnUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FavoriteMetricOnUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `FavoriteMetric` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FavoriteMetricOnUser_pkey" PRIMARY KEY ("userId", "favoriteMetricId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMetric_name_key" ON "FavoriteMetric"("name");
