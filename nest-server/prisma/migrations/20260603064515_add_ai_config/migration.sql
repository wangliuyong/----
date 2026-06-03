-- CreateTable
CREATE TABLE "AiConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "openaiApiKey" TEXT,
    "openaiBaseUrl" TEXT NOT NULL DEFAULT 'https://api.openai.com/v1',
    "updatedAt" DATETIME NOT NULL
);
