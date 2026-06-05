-- CreateTable
CREATE TABLE "SitePageView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "SitePageView_createdAt_idx" ON "SitePageView"("createdAt");

-- CreateIndex
CREATE INDEX "SitePageView_path_idx" ON "SitePageView"("path");
