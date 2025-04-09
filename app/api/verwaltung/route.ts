// app/api/verwaltung/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Nicht autorisiert" },
      { status: 401 }
    );
  }

  try {
    const konfigurationen = await prisma.konfiguration.findMany({
      where: { userId: session.user.id },
      include: {
        fahrzeug: true,
        motor: true,
        farbe: true,
        felgen: true,
        ausstattungen: {
          include: {
            ausstattung: true, 
          },
        },
      },
    });

    const formattedKonfigurationen = konfigurationen.map((konfig) => ({
      id: konfig.id,
      fahrzeugId: konfig.fahrzeugId,
      fahrzeug: konfig.fahrzeug
        ? `${konfig.fahrzeug.marke} ${konfig.fahrzeug.modell}`
        : "Unbekanntes Fahrzeug",
      motor: konfig.motor ? konfig.motor.name : "Unbekannter Motor",
      farbe: konfig.farbe ? konfig.farbe.name : "Unbekannte Farbe",
      felgen: konfig.felgen ? konfig.felgen.name : "Unbekannte Felgen",
      gesamtpreis: konfig.gesamtpreis,
      isBestellt: konfig.isBestellt,
      createdAt: konfig.createdAt.toISOString(),
      options: konfig.ausstattungen.map((item) => ({
        name: item.ausstattung.name,
        value: item.ausstattung.beschreibung,
        preis: item.ausstattung.preis,
        kategorie: item.ausstattung.kategorie,
      })),
    }));

    const bestellungen = []; 

    return NextResponse.json({ konfigurationen: formattedKonfigurationen, bestellungen });
  } catch (error) {
    console.error("Fehler in /api/verwaltung:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Daten" },
      { status: 500 }
    );
  }
}