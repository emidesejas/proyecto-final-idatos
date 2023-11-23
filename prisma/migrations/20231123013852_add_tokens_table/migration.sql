-- CreateTable
CREATE TABLE "public"."Tokens" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_token_idx" ON "public"."Tokens"("service");
