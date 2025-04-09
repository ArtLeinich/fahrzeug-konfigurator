-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regionId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FahrzeugKategorie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,

    CONSTRAINT "FahrzeugKategorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fahrzeug" (
    "id" TEXT NOT NULL,
    "marke" TEXT NOT NULL,
    "modell" TEXT NOT NULL,
    "baujahr" INTEGER NOT NULL,
    "basisPreis" DOUBLE PRECISION NOT NULL,
    "bildUrl" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "verfuegbar" BOOLEAN NOT NULL,
    "kategorieId" TEXT NOT NULL,

    CONSTRAINT "Fahrzeug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ps" INTEGER NOT NULL,
    "hubraum" INTEGER NOT NULL,
    "kraftstoff" TEXT NOT NULL,
    "verbrauch" DOUBLE PRECISION NOT NULL,
    "co2Ausstoss" DOUBLE PRECISION NOT NULL,
    "preis" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Motor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farbe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farbcode" TEXT NOT NULL,
    "preis" DOUBLE PRECISION NOT NULL,
    "typ" TEXT NOT NULL,

    CONSTRAINT "Farbe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Felgen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groesse" INTEGER NOT NULL,
    "design" TEXT NOT NULL,
    "preis" DOUBLE PRECISION NOT NULL,
    "bildUrl" TEXT NOT NULL,

    CONSTRAINT "Felgen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FahrzeugAusstattung" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "preis" DOUBLE PRECISION NOT NULL,
    "kategorie" TEXT NOT NULL,

    CONSTRAINT "FahrzeugAusstattung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bestellung" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "konfigurationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Neu',
    "bestellDatum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lieferDatum" TIMESTAMP(3),

    CONSTRAINT "Bestellung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konfiguration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fahrzeugId" TEXT NOT NULL,
    "motorId" TEXT,
    "farbeId" TEXT,
    "felgenId" TEXT,
    "gesamtpreis" DOUBLE PRECISION NOT NULL,
    "isBestellt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Konfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KonfigurationAusstattung" (
    "konfigurationId" TEXT NOT NULL,
    "ausstattungId" TEXT NOT NULL,

    CONSTRAINT "KonfigurationAusstattung_pkey" PRIMARY KEY ("konfigurationId","ausstattungId")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bestellung_konfigurationId_key" ON "Bestellung"("konfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fahrzeug" ADD CONSTRAINT "Fahrzeug_kategorieId_fkey" FOREIGN KEY ("kategorieId") REFERENCES "FahrzeugKategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bestellung" ADD CONSTRAINT "Bestellung_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bestellung" ADD CONSTRAINT "Bestellung_konfigurationId_fkey" FOREIGN KEY ("konfigurationId") REFERENCES "Konfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konfiguration" ADD CONSTRAINT "Konfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konfiguration" ADD CONSTRAINT "Konfiguration_fahrzeugId_fkey" FOREIGN KEY ("fahrzeugId") REFERENCES "Fahrzeug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konfiguration" ADD CONSTRAINT "Konfiguration_motorId_fkey" FOREIGN KEY ("motorId") REFERENCES "Motor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konfiguration" ADD CONSTRAINT "Konfiguration_farbeId_fkey" FOREIGN KEY ("farbeId") REFERENCES "Farbe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konfiguration" ADD CONSTRAINT "Konfiguration_felgenId_fkey" FOREIGN KEY ("felgenId") REFERENCES "Felgen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonfigurationAusstattung" ADD CONSTRAINT "KonfigurationAusstattung_konfigurationId_fkey" FOREIGN KEY ("konfigurationId") REFERENCES "Konfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonfigurationAusstattung" ADD CONSTRAINT "KonfigurationAusstattung_ausstattungId_fkey" FOREIGN KEY ("ausstattungId") REFERENCES "FahrzeugAusstattung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
