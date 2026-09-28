-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "complimentaryNote" TEXT,
ADD COLUMN     "grantedById" TEXT,
ADD COLUMN     "isComplimentary" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
