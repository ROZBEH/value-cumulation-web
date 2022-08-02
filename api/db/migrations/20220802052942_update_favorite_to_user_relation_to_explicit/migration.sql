/*
  Warnings:

  - You are about to drop the `_FavoriteMetricToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FavoriteMetricToUser" DROP CONSTRAINT "_FavoriteMetricToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteMetricToUser" DROP CONSTRAINT "_FavoriteMetricToUser_B_fkey";

-- DropTable
DROP TABLE "_FavoriteMetricToUser";

-- CreateTable
CREATE TABLE "FavoriteMetricOnUser" (
    "id" SERIAL NOT NULL,
    "favoriteMetricId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteMetricOnUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey" FOREIGN KEY ("favoriteMetricId") REFERENCES "FavoriteMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
