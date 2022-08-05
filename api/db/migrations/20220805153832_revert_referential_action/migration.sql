-- DropForeignKey
ALTER TABLE "FavoriteMetricOnUser" DROP CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey";

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey" FOREIGN KEY ("favoriteMetricId") REFERENCES "FavoriteMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
