-- CreateEnum
CREATE TYPE "public"."SlaState" AS ENUM ('ON_TRACK', 'AT_RISK', 'BREACHED');

-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "firstResponseDeadline" TIMESTAMP(3),
ADD COLUMN     "resolutionDeadline" TIMESTAMP(3),
ADD COLUMN     "slaState" "public"."SlaState" NOT NULL DEFAULT 'ON_TRACK';
