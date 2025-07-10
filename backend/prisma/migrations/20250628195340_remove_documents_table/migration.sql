/*
  Warnings:

  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `documentId` on the `file_uploads` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "documents";
PRAGMA foreign_keys=on;

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
    "functionalSpecificationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "file_uploads_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_uploads_functionalSpecificationId_fkey" FOREIGN KEY ("functionalSpecificationId") REFERENCES "functional_specifications" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_file_uploads" ("createdAt", "filename", "functionalSpecificationId", "id", "mimetype", "originalName", "path", "size", "uploadedById") SELECT "createdAt", "filename", "functionalSpecificationId", "id", "mimetype", "originalName", "path", "size", "uploadedById" FROM "file_uploads";
DROP TABLE "file_uploads";
ALTER TABLE "new_file_uploads" RENAME TO "file_uploads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
