-- AlterTable
ALTER TABLE "User" ADD COLUMN "phoneVerificationCode" TEXT;
ALTER TABLE "User" ADD COLUMN "phoneVerificationExpiresAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TutorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "yearsExperience" INTEGER,
    "introVideoUrl" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "verifiedTrusted" BOOLEAN NOT NULL DEFAULT false,
    "pinnedComment" TEXT,
    "offersStudentToTutor" BOOLEAN NOT NULL DEFAULT false,
    "offersTutorToStudent" BOOLEAN NOT NULL DEFAULT false,
    "offersOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TutorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TutorProfile" ("bio", "createdAt", "id", "introVideoUrl", "isApproved", "pinnedComment", "updatedAt", "userId", "verifiedTrusted", "yearsExperience") SELECT "bio", "createdAt", "id", "introVideoUrl", "isApproved", "pinnedComment", "updatedAt", "userId", "verifiedTrusted", "yearsExperience" FROM "TutorProfile";
DROP TABLE "TutorProfile";
ALTER TABLE "new_TutorProfile" RENAME TO "TutorProfile";
CREATE UNIQUE INDEX "TutorProfile_userId_key" ON "TutorProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
