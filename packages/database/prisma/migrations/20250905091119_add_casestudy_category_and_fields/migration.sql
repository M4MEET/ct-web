-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT,
    "sector" TEXT,
    "category" TEXT NOT NULL DEFAULT 'caseStudy',
    "icon" TEXT,
    "order" INTEGER,
    "pageId" TEXT,
    "seo" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CaseStudy_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CaseStudy" ("client", "createdAt", "id", "locale", "sector", "seo", "slug", "status", "title", "updatedAt") SELECT "client", "createdAt", "id", "locale", "sector", "seo", "slug", "status", "title", "updatedAt" FROM "CaseStudy";
DROP TABLE "CaseStudy";
ALTER TABLE "new_CaseStudy" RENAME TO "CaseStudy";
CREATE UNIQUE INDEX "CaseStudy_slug_locale_key" ON "CaseStudy"("slug", "locale");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
