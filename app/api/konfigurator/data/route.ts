// app/api/konfigurator/data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [fahrzeuge, motoren, farben, felgen, ausstattungen, kategorien] = await Promise.all([
      prisma.fahrzeug.findMany({ include: { kategorie: true } }),
      prisma.motor.findMany(),
      prisma.farbe.findMany(),
      prisma.felgen.findMany(),
      prisma.fahrzeugAusstattung.findMany(),
      prisma.fahrzeugKategorie.findMany({ include: { fahrzeuge: true } }),
    ]);

    return NextResponse.json({
      fahrzeuge,
      motoren,
      farben,
      felgen,
      ausstattungen,
      kategorien,
    });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden der Daten" }, { status: 500 });
  }
}