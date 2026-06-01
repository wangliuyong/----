-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT '王刘永的博客',
    "githubUrl" TEXT NOT NULL DEFAULT 'https://github.com/wly-dev',
    "email" TEXT NOT NULL DEFAULT 'hello@wly.dev',
    "navJson" TEXT NOT NULL DEFAULT '[]',
    "aboutJson" TEXT NOT NULL DEFAULT '{}',
    "contactJson" TEXT NOT NULL DEFAULT '{}'
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
