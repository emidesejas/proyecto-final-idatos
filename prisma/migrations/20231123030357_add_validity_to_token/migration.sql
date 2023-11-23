/*
  Warnings:

  - Added the required column `validUntil` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Tokens" ADD COLUMN     "validUntil" TIMESTAMP NOT NULL;
