// app/api/admin/kunden/[id]/bestellungen/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { id: userId } = await params;

  try {
    const bestellungen = await prisma.bestellung.findMany({
      where: { userId: userId },
      include: {
        konfiguration: {
          include: { fahrzeug: true },
        },
      },
    });

    const formattedBestellungen = bestellungen.map((bestellung) => {
      const produkt = bestellung.konfiguration
        ? `${bestellung.konfiguration.fahrzeug.marke} ${bestellung.konfiguration.fahrzeug.modell}`
        : "Unbekanntes Produkt";
      return {
        id: bestellung.id,
        produkt: produkt,
        preis: bestellung.konfiguration ? bestellung.konfiguration.gesamtpreis : 0,
        status: bestellung.status,
        bestellDatum: bestellung.bestellDatum.toISOString(),
      };
    });

    console.log("Formatted Bestellungen:", formattedBestellungen); 
    return NextResponse.json(formattedBestellungen);
  } catch (error) {
    console.error("Fehler in /api/admin/kunden/[id]/bestellungen:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Bestellungen" }, { status: 500 });
  }
}