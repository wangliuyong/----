-- AlterTable: 扩展 SitePageView，记录 IP、UA、浏览器、地区等访客信息
ALTER TABLE "SitePageView" ADD COLUMN "ip" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "userAgent" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "browser" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "os" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "device" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "locale" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "timezone" TEXT;
ALTER TABLE "SitePageView" ADD COLUMN "region" TEXT;
