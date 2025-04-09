import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const bestellungen = await prisma.bestellung.findMany({
      where: { userId: session.user.id },
      include: {
        konfiguration: {
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
        },
      },
    });

    const formattedBestellungen = bestellungen.map((bestellung) => ({
      id: bestellung.id,
      konfigurationId: bestellung.konfigurationId,
      fahrzeugName: `${bestellung.konfiguration?.fahrzeug?.marke || "Unbekannt"} ${
        bestellung.konfiguration?.fahrzeug?.modell || ""
      }`,
      gesamtPreis: bestellung.konfiguration?.gesamtpreis || 0,
      bestellDatum: bestellung.bestellDatum,
      lieferDatum: bestellung.lieferDatum,
      status: bestellung.status,
      motor: bestellung.konfiguration?.motor?.name || "Unbekannter Motor",
      farbe: bestellung.konfiguration?.farbe?.name || "Unbekannte Farbe",
      felgen: bestellung.konfiguration?.felgen?.name || "Unbekannte Felgen",
      baujahr: bestellung.konfiguration?.fahrzeug?.baujahr?.toString() || "Unbekannt", 
      options: bestellung.konfiguration?.ausstattungen?.map((item) => ({
        name: item.ausstattung?.name || "Unbekannte Option",
        kategorie: item.ausstattung?.kategorie || "Unbekannt",
        preis: item.ausstattung?.preis ?? 0, 
        value: item.ausstattung?.name || "Unbekannt",
      })) || [],
    }));

    return NextResponse.json({ bestellungen: formattedBestellungen });
  } catch (error) {
    console.error("Fehler beim Laden der Bestellungen:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Bestellungen" }, { status: 500 });
  }
}