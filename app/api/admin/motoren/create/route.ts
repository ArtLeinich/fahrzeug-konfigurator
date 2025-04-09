import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
// Autorisierung prüfen
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const data = await req.json();
    // Datenüberprüfung
    if (!data.name || !data.kraftstoff) {
      return NextResponse.json({ error: "Name und Kraftstoff sind erforderlich" }, { status: 400 });
    }

    const motor = await prisma.motor.create({
      data: {
        name: data.name,
        ps: data.ps || 0,
        hubraum: data.hubraum || 0,
        kraftstoff: data.kraftstoff,
        verbrauch: data.verbrauch || 0,
        co2Ausstoss: data.co2Ausstoss || 0,
        preis: data.preis || 0,
      },
    });
    return NextResponse.json(motor, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Erstellen eines Motors:", error);
    return NextResponse.json({ error: "Fehler beim Hinzufügen" }, { status: 500 });
  }
}