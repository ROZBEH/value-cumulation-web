/*
  Warnings:

  - The primary key for the `FavoriteMetric` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FavoriteMetricOnUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_userId_fkey";

-- AlterTable
ALTER TABLE "FavoriteMetric" DROP CONSTRAINT "FavoriteMetric_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FavoriteMetric_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FavoriteMetric_id_seq";

-- AlterTable
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_pkey",
ALTER COLUMN "favoriteMetricId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FavoriteMetricOnUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FavoriteMetricOnUser_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey" FOREIGN KEY ("favoriteMetricId") REFERENCES "FavoriteMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
