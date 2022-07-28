-- CreateTable
CREATE TABLE "WorkloadRecord" (
    "id" SERIAL NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,

    CONSTRAINT "WorkloadRecord_pkey" PRIMARY KEY ("id")
);
