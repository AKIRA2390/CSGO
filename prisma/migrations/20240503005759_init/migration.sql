-- CreateTable
CREATE TABLE "Dictionary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "hskLevel" INTEGER NOT NULL,
    "sentenceID" INTEGER NOT NULL,
    "dictionaryID" INTEGER NOT NULL,
    CONSTRAINT "Word_sentenceID_fkey" FOREIGN KEY ("sentenceID") REFERENCES "Sentence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Word_dictionaryID_fkey" FOREIGN KEY ("dictionaryID") REFERENCES "Dictionary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sentence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL
);
