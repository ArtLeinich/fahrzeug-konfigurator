import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ error: "Fahrzeug-ID fehlt" }, { status: 400 });
    }

    interface UpdateData {
      marke?: string;
      modell?: string;
      basisPreis?: number;
      bildUrl?: string;
      beschreibung?: string;
      baujahr?: number;
      verfuegbar?: boolean;
      kategorieId?: string;
    }
    const updateData: UpdateData = {};
    const marke = formData.get("marke") as string;
    const modell = formData.get("modell") as string;
    const basisPreis = formData.get("basisPreis") as string;
    const bildUrl = formData.get("bildUrl");
    const beschreibung = formData.get("beschreibung") as string;
    const baujahr = formData.get("baujahr") as string;
    const verfuegbar = formData.get("verfuegbar") as string;
    const kategorieId = formData.get("kategorieId") as string;

    console.log("Eingehende FormData:", {
      id,
      marke,
      modell,
      basisPreis,
      bildUrl,
      beschreibung,
      baujahr,
      verfuegbar,
      kategorieId,
    });

    if (marke) updateData.marke = marke;
    if (modell) updateData.modell = modell;
    if (basisPreis) {
      const parsedPreis = parseFloat(basisPreis);
      if (isNaN(parsedPreis)) {
        return NextResponse.json({ error: "Ungültiger Basispreis" }, { status: 400 });
      }
      updateData.basisPreis = parsedPreis;
    }
    if (bildUrl instanceof File) {
      const buffer = Buffer.from(await bildUrl.arrayBuffer());
      const fileName = `${Date.now()}-${bildUrl.name}`;
      const uploadDir = join(process.cwd(), "public/uploads");
      const filePath = join(uploadDir, fileName);

      // Erstelle den Upload-Ordner, falls er nicht existiert
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
        console.log("Uploads-Ordner erstellt:", uploadDir);
      }

      console.log("Speichere Bild unter:", filePath);
      await writeFile(filePath, buffer);
      updateData.bildUrl = `/uploads/${fileName}`;
    }
    if (beschreibung) updateData.beschreibung = beschreibung;
    if (baujahr) {
      const parsedBaujahr = parseInt(baujahr);
      if (isNaN(parsedBaujahr)) {
        return NextResponse.json({ error: "Ungültiges Baujahr" }, { status: 400 });
      }
      updateData.baujahr = parsedBaujahr;
    }
    if (verfuegbar !== null && verfuegbar !== undefined) {
      updateData.verfuegbar = verfuegbar === "true";
    }
    if (kategorieId) updateData.kategorieId = kategorieId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Keine Daten zum Aktualisieren" }, { status: 400 });
    }

    console.log("Update-Daten für Prisma:", updateData);

    const updatedFahrzeug = await prisma.fahrzeug.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedFahrzeug);
  } catch (error: unknown) {
    console.error("Fehler beim Aktualisieren:", error); // Log the full error for debugging
    let errorMessage = "Fehler beim Aktualisieren des Fahrzeugs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}