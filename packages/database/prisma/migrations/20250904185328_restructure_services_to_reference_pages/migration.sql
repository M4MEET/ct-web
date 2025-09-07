/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `seo` on the `Service` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "pageId" TEXT,
    "postId" TEXT,
    "caseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Block_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Block_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Block_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseStudy" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Block" ("caseId", "createdAt", "data", "id", "order", "pageId", "postId", "type", "updatedAt") SELECT "caseId", "createdAt", "data", "id", "order", "pageId", "postId", "type", "updatedAt" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
CREATE INDEX "Block_pageId_idx" ON "Block"("pageId");
CREATE INDEX "Block_postId_idx" ON "Block"("postId");
CREATE INDEX "Block_caseId_idx" ON "Block"("caseId");
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "icon" TEXT,
    "order" INTEGER,
    "pageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Service_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("createdAt", "id", "locale", "name", "slug", "status", "summary", "updatedAt") SELECT "createdAt", "id", "locale", "name", "slug", "status", "summary", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_locale_key" ON "Service"("slug", "locale");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
