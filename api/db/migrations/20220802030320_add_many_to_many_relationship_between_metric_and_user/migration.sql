/*
  Warnings:

  - You are about to drop the column `favoriteMetrics` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favoriteMetrics";

-- CreateTable
CREATE TABLE "FavoriteMetric" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FavoriteMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavoriteMetricToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteMetricToUser_AB_unique" ON "_FavoriteMetricToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteMetricToUser_B_index" ON "_FavoriteMetricToUser"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteMetricToUser" ADD CONSTRAINT "_FavoriteMetricToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FavoriteMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteMetricToUser" ADD CONSTRAINT "_FavoriteMetricToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
