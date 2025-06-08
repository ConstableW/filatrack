-- CreateTable
CREATE TABLE "Filament" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "currentMass" INTEGER NOT NULL,
    "startingMass" INTEGER NOT NULL,
    "isEmpty" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilamentUse" (
    "id" TEXT NOT NULL,
    "filamentId" TEXT NOT NULL,
    "filamentUsed" INTEGER NOT NULL,
    "previousMass" INTEGER NOT NULL,
    "newMass" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilamentUse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filament" ADD CONSTRAINT "Filament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilamentUse" ADD CONSTRAINT "FilamentUse_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
