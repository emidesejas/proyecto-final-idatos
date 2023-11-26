/*
  Warnings:

  - A unique constraint covering the columns `[trackId,externalId,type]` on the table `Identifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artistId,externalId,type]` on the table `Identifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[albumId,externalId,type]` on the table `Identifier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Track" ALTER COLUMN "releaseDate" DROP NOT NULL,
ALTER COLUMN "playCount" DROP NOT NULL,
ALTER COLUMN "listeners" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "track_id_external_id_type_identifier_idx" ON "public"."Identifier"("trackId", "externalId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "artist_id_external_id_type_identifier_idx" ON "public"."Identifier"("artistId", "externalId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "album_id_external_id_type_identifier_idx" ON "public"."Identifier"("albumId", "externalId", "type");
