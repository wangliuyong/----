-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "username" TEXT,
    "action" TEXT NOT NULL,
    "module" TEXT,
    "targetId" TEXT,
    "detail" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AppLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "stack" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AiSyncRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sources" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME
);
