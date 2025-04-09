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
    const kategorien = await prisma.fahrzeugKategorie.findMany({
      select: {
        id: true,
        name: true, // Wir verwenden das "name"-Feld für die Anzeige
      },
    });
    return NextResponse.json(kategorien);
  } catch (error) {
    console.error("Fehler beim Abrufen der Fahrzeugkategorien:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Fahrzeugkategorien" },
      { status: 500 }
    );
  }
}