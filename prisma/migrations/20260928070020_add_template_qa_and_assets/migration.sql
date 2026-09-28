-- CreateEnum
CREATE TYPE "TemplateAssetType" AS ENUM ('IMAGE', 'VIDEO', 'LOTTIE', 'FONT');

-- CreateEnum
CREATE TYPE "TemplateQaStatus" AS ENUM ('PENDING_REVIEW', 'RESPONSIVE_OK', 'NEEDS_FIX');

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "previewDesktopUrl" TEXT,
ADD COLUMN     "previewMobileUrl" TEXT,
ADD COLUMN     "qaNote" TEXT,
ADD COLUMN     "qaStatus" "TemplateQaStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "responsiveCheckedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "template_assets" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "type" "TemplateAssetType" NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_assets_templateId_key_key" ON "template_assets"("templateId", "key");

-- AddForeignKey
ALTER TABLE "template_assets" ADD CONSTRAINT "template_assets_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: Template yang sudah aktif diberi RESPONSIVE_OK agar katalog tidak kosong
UPDATE "templates" SET "qaStatus" = 'RESPONSIVE_OK', "responsiveCheckedAt" = CURRENT_TIMESTAMP WHERE "isActive" = true;
