-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "countries" TEXT NOT NULL DEFAULT '[]',
    "topics" TEXT NOT NULL DEFAULT '[]',
    "sources" TEXT NOT NULL DEFAULT '[]',
    "minScore" REAL NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'es',
    "osintMode" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sourceName" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT NOT NULL DEFAULT 'es',
    "country" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "locationName" TEXT,
    "sentimentLabel" TEXT DEFAULT 'neutral',
    "sentimentScore" REAL DEFAULT 0,
    "summary" TEXT,
    "importanceScore" REAL NOT NULL DEFAULT 0,
    "velocityScore" REAL NOT NULL DEFAULT 0,
    "credibilityScore" REAL NOT NULL DEFAULT 0.5,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateTable
CREATE TABLE "NewsEntity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "relevance" REAL NOT NULL DEFAULT 0,
    "mentions" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "NewsEntity_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "credibility" REAL NOT NULL DEFAULT 0.5,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsSource_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsTimeline_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsBookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    CONSTRAINT "NewsBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NewsBookmark_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "velocity" REAL NOT NULL DEFAULT 0,
    "sentiment" REAL NOT NULL DEFAULT 0,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "News_url_key" ON "News"("url");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "News"("publishedAt");

-- CreateIndex
CREATE INDEX "News_importanceScore_idx" ON "News"("importanceScore");

-- CreateIndex
CREATE INDEX "News_status_idx" ON "News"("status");

-- CreateIndex
CREATE INDEX "News_country_idx" ON "News"("country");

-- CreateIndex
CREATE INDEX "NewsEntity_newsId_idx" ON "NewsEntity"("newsId");

-- CreateIndex
CREATE INDEX "NewsEntity_name_idx" ON "NewsEntity"("name");

-- CreateIndex
CREATE INDEX "NewsSource_newsId_idx" ON "NewsSource"("newsId");

-- CreateIndex
CREATE INDEX "NewsTimeline_newsId_idx" ON "NewsTimeline"("newsId");

-- CreateIndex
CREATE INDEX "NewsTimeline_timestamp_idx" ON "NewsTimeline"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "NewsBookmark_userId_newsId_key" ON "NewsBookmark"("userId", "newsId");

-- CreateIndex
CREATE UNIQUE INDEX "Trend_topic_key" ON "Trend"("topic");
