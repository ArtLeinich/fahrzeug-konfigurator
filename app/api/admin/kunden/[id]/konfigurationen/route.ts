// app/api/admin/kunden/[id]/konfigurationen/route.ts
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
    const konfigurationen = await prisma.konfiguration.findMany({
      where: { userId: userId },
      include: {
        fahrzeug: true,
        motor: true,
        farbe: true,
        felgen: true,
        ausstattungen: {
          include: {
            ausstattung: true, // Daten aus der FahrzeugAusstattung einbeziehen
          },
        },
      },
    });

    const formattedKonfigurationen = konfigurationen.map((konfig) => ({
      id: konfig.id,
      fahrzeug: konfig.fahrzeug
        ? `${konfig.fahrzeug.marke} ${konfig.fahrzeug.modell}`
        : "Unbekanntes Fahrzeug",
      motor: konfig.motor ? konfig.motor.name : "Unbekannter Motor",
      farbe: konfig.farbe ? konfig.farbe.name : "Unbekannte Farbe",
      felgen: konfig.felgen ? konfig.felgen.name : "Unbekannte Felgen",
      gesamtpreis: konfig.gesamtpreis,
      createdAt: konfig.createdAt.toISOString(),
      // Zusätzliche Optionen formatieren
      options: konfig.ausstattungen.map((item) => ({
        name: item.ausstattung.name,
        value: item.ausstattung.beschreibung,
        preis: item.ausstattung.preis,
        kategorie: item.ausstattung.kategorie,
      })),
    }));

    console.log("Formatted Konfigurationen:", formattedKonfigurationen);
    return NextResponse.json(formattedKonfigurationen);
  } catch (error) {
    console.error("Ошибка в /api/admin/kunden/[id]/konfigurationen:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Konfigurationen" }, { status: 500 });
  }
}