-- CreateTable
CREATE TABLE "ConvUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "openId" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "realName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConvCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ConvCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ConvCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConvBanner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "online" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ConvNotice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConvCityInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "price" REAL,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "auditStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "collectCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConvCityInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ConvUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConvCityInfo_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ConvCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConvCollect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "infoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConvCollect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ConvUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConvCollect_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "ConvCityInfo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConvReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "infoId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConvReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ConvUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConvReport_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "ConvCityInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConvAiSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConvAiSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ConvUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConvAiMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConvAiMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ConvAiSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ConvUser_openId_key" ON "ConvUser"("openId");

-- CreateIndex
CREATE UNIQUE INDEX "ConvUser_phone_key" ON "ConvUser"("phone");

-- CreateIndex
CREATE INDEX "ConvCityInfo_categoryId_idx" ON "ConvCityInfo"("categoryId");

-- CreateIndex
CREATE INDEX "ConvCityInfo_userId_idx" ON "ConvCityInfo"("userId");

-- CreateIndex
CREATE INDEX "ConvCityInfo_auditStatus_idx" ON "ConvCityInfo"("auditStatus");

-- CreateIndex
CREATE INDEX "ConvCityInfo_createdAt_idx" ON "ConvCityInfo"("createdAt");

-- CreateIndex
CREATE INDEX "ConvCollect_userId_idx" ON "ConvCollect"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConvCollect_userId_infoId_key" ON "ConvCollect"("userId", "infoId");

-- CreateIndex
CREATE INDEX "ConvAiMessage_sessionId_idx" ON "ConvAiMessage"("sessionId");

