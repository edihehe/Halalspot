-- CreateTable
CREATE TABLE "RestaurantRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "isBusiness" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" TEXT,
    "status" TEXT,
    "pickupTime" TEXT,
    "verificationDate" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
