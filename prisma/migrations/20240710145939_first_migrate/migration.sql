-- CreateTable
CREATE TABLE "TRichieste" (
    "RichiestaID" SERIAL NOT NULL,
    "CognomeNomeRichiedente" TEXT NOT NULL,
    "DataInserimentoRichiesta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Importo" INTEGER NOT NULL,
    "NumeroRate" INTEGER NOT NULL,

    CONSTRAINT "TRichieste_pkey" PRIMARY KEY ("RichiestaID")
);

-- CreateIndex
CREATE UNIQUE INDEX "TRichieste_RichiestaID_key" ON "TRichieste"("RichiestaID");

-- CreateIndex
CREATE UNIQUE INDEX "TRichieste_CognomeNomeRichiedente_key" ON "TRichieste"("CognomeNomeRichiedente");
