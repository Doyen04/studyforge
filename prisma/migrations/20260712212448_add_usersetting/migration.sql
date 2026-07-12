-- CreateTable
CREATE TABLE "UserSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "geminiApiKey" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);
