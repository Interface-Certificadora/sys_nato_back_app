/*
  Warnings:

  - You are about to drop the column `userId` on the `Biometria` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dataNascimento` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `clienteId` to the `Biometria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Biometria" DROP CONSTRAINT "Biometria_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropIndex
DROP INDEX "user_unique";

-- AlterTable
ALTER TABLE "Biometria" DROP COLUMN "userId",
ADD COLUMN     "clienteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "userId",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ALTER COLUMN "arquivoDocumento" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf",
DROP COLUMN "dataNascimento",
DROP COLUMN "password";

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "telefone2" TEXT,
    "dtNascimento" TIMESTAMP(3),
    "dtSolicitacao" TIMESTAMP(3) NOT NULL,
    "idFcw" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "andamento" TEXT NOT NULL,
    "statusPgto" TEXT,
    "valorCd" INTEGER NOT NULL,
    "docSuspenso" TEXT,
    "alertaNow" BOOLEAN NOT NULL DEFAULT false,
    "dtCriacaoNow" TIMESTAMP(3),
    "statusAtendimento" BOOLEAN NOT NULL DEFAULT true,
    "corretor" TEXT NOT NULL,
    "construtora" TEXT NOT NULL,
    "empreendimento" TEXT NOT NULL,
    "financeiro" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- AddForeignKey
ALTER TABLE "Biometria" ADD CONSTRAINT "Biometria_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
