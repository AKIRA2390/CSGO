/*
  Warnings:

  - You are about to drop the column `text` on the `Sentence` table. All the data in the column will be lost.
  - Added the required column `chinese` to the `Sentence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `japanese` to the `Sentence` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sentence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chinese" TEXT NOT NULL,
    "japanese" TEXT NOT NULL
);
INSERT INTO "new_Sentence" ("id") SELECT "id" FROM "Sentence";
DROP TABLE "Sentence";
ALTER TABLE "new_Sentence" RENAME TO "Sentence";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
