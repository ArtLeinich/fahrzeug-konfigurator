// app/api/admin/fahrzeuge/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const data = await req.json();
    console.log("Erstelle neues Fahrzeug mit Daten:", data);

    const newFahrzeug = await prisma.fahrzeug.create({
      data: {
        marke: data.marke,
        modell: data.modell,
        basisPreis: data.basisPreis,
        bildUrl: data.bildUrl,
        beschreibung: data.beschreibung,
        verfuegbar: data.verfuegbar,
        kategorieId: data.kategorieId,
        baujahr: data.baujahr, 
      },
    });

    return NextResponse.json(newFahrzeug);
  }  catch (error: unknown) {
    console.error("Fehler beim Erstellen des Fahrzeugs:", error);
    let errorMessage = "Fehler beim Erstellen des Fahrzeugs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}