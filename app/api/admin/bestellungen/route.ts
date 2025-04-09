// app/api/admin/bestellungen/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const bestellungen = await prisma.bestellung.findMany({
      include: {
        konfiguration: {
          include: { fahrzeug: true },
        },
        user: true,
      },
    });

    const formattedBestellungen = bestellungen.map((bestellung) => ({
      id: bestellung.id,
      konfigurationId: bestellung.konfigurationId,
      fahrzeugName: `${bestellung.konfiguration.fahrzeug.marke} ${bestellung.konfiguration.fahrzeug.modell}`,
      gesamtPreis: bestellung.konfiguration.gesamtpreis,
      bestellDatum: bestellung.bestellDatum,
      lieferDatum: bestellung.lieferDatum,
      status: bestellung.status,
      userName:
        bestellung.user.lastName && bestellung.user.firstName
          ? `${bestellung.user.firstName} ${bestellung.user.lastName}`
          : bestellung.user.email,
    }));

    return NextResponse.json({ bestellungen: formattedBestellungen });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Laden der Bestellungen" },
      { status: 500 }
    );
  }
}
