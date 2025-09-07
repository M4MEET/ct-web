-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "service" TEXT,
    "budget" TEXT,
    "timeline" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "notes" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormSubmission_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormAttachment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormSubmission_email_idx" ON "FormSubmission"("email");

-- CreateIndex
CREATE INDEX "FormSubmission_createdAt_idx" ON "FormSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "FormAttachment_submissionId_idx" ON "FormAttachment"("submissionId");
