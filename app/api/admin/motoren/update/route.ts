import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const { id, name, ps, hubraum, kraftstoff, verbrauch, co2Ausstoss, preis } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Motor-ID fehlt" }, { status: 400 });
    }

    const updateData: any = {};

     // Fügen Sie nur die Felder hinzu, die übergeben und gültig sind
    if (name !== undefined) updateData.name = name;
    if (ps !== undefined) {
      const parsedPs = parseInt(ps);
      if (isNaN(parsedPs)) {
        return NextResponse.json({ error: "Ungültige PS-Zahl" }, { status: 400 });
      }
      updateData.ps = parsedPs;
    }
    if (hubraum !== undefined) {
      const parsedHubraum = parseInt(hubraum);
      if (isNaN(parsedHubraum)) {
        return NextResponse.json({ error: "Ungültiger Hubraum" }, { status: 400 });
      }
      updateData.hubraum = parsedHubraum;
    }
    if (kraftstoff !== undefined) updateData.kraftstoff = kraftstoff;
    if (verbrauch !== undefined) {
      const parsedVerbrauch = parseFloat(verbrauch);
      if (isNaN(parsedVerbrauch)) {
        return NextResponse.json({ error: "Ungültiger Verbrauch" }, { status: 400 });
      }
      updateData.verbrauch = parsedVerbrauch;
    }
    if (co2Ausstoss !== undefined) {
      const parsedCo2Ausstoss = parseFloat(co2Ausstoss);
      if (isNaN(parsedCo2Ausstoss)) {
        return NextResponse.json({ error: "Ungültiger CO₂-Ausstoß" }, { status: 400 });
      }
      updateData.co2Ausstoss = parsedCo2Ausstoss;
    }
    if (preis !== undefined) {
      const parsedPreis = parseFloat(preis);
      if (isNaN(parsedPreis)) {
        return NextResponse.json({ error: "Ungültiger Preis" }, { status: 400 });
      }
      updateData.preis = parsedPreis;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Keine Daten zum Aktualisieren" }, { status: 400 });
    }

    const updatedMotor = await prisma.motor.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedMotor);
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    return NextResponse.json(
      { error: error.message || "Fehler beim Aktualisieren des Motors" },
      { status: 500 }
    );
  }
}