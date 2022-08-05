/*
  Warnings:

  - The primary key for the `FavoriteMetricOnUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,favoriteMetricId]` on the table `FavoriteMetricOnUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "FavoriteMetricOnUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMetricOnUser_userId_favoriteMetricId_key" ON "FavoriteMetricOnUser"("userId", "favoriteMetricId");
