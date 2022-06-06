-- CreateTable
CREATE TABLE "Post" (
    "dateSlug" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
