-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT NOT NULL DEFAULT E'',
    "salt" TEXT NOT NULL DEFAULT E'',
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteMetric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FavoriteMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteMetricOnUser" (
    "id" TEXT NOT NULL,
    "favoriteMetricId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteMetricOnUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMetric_name_key" ON "FavoriteMetric"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMetricOnUser_userId_favoriteMetricId_key" ON "FavoriteMetricOnUser"("userId", "favoriteMetricId");

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMetricOnUser" ADD CONSTRAINT "FavoriteMetricOnUser_favoriteMetricId_fkey" FOREIGN KEY ("favoriteMetricId") REFERENCES "FavoriteMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
