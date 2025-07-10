-- CreateTable
CREATE TABLE "functional_specifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardNumber" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "technicalAnalyst" TEXT NOT NULL,
    "gmud" TEXT,
    "date" DATETIME NOT NULL,
    "version" TEXT NOT NULL,
    "developmentEnvironment" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "comment" TEXT,
    "developmentDescription" TEXT NOT NULL,
    "functionalSpecification" TEXT NOT NULL,
    "changeDescription" TEXT NOT NULL,
    "order" TEXT,
    "status" TEXT NOT NULL,
    "startDateTime" DATETIME NOT NULL,
    "endDateTime" DATETIME,
    "includeCutoverPlan" BOOLEAN NOT NULL DEFAULT false,
    "cutoverObjective" TEXT,
    "cutoverTimeline" TEXT,
    "cutoverDetailedActivities" TEXT,
    "cutoverPreChecklistActivities" TEXT,
    "cutoverCommunicationPlan" TEXT,
    "cutoverTeamsAndResponsibilities" TEXT,
    "cutoverContingencyPlan" TEXT,
    "cutoverSuccessCriteria" TEXT,
    "cutoverPostGoLiveSupport" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "functional_specifications_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "functional_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "priority" TEXT,
    "functionalSpecificationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "functional_requests_functionalSpecificationId_fkey" FOREIGN KEY ("functionalSpecificationId") REFERENCES "functional_specifications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_file_uploads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "documentId" TEXT,
    "functionalSpecificationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "file_uploads_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_uploads_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "file_uploads_functionalSpecificationId_fkey" FOREIGN KEY ("functionalSpecificationId") REFERENCES "functional_specifications" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_file_uploads" ("createdAt", "documentId", "filename", "id", "mimetype", "originalName", "path", "size", "uploadedById") SELECT "createdAt", "documentId", "filename", "id", "mimetype", "originalName", "path", "size", "uploadedById" FROM "file_uploads";
DROP TABLE "file_uploads";
ALTER TABLE "new_file_uploads" RENAME TO "file_uploads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
