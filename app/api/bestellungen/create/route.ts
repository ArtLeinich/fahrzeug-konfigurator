// app/api/bestellungen/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { konfigurationId } = await req.json();

  try {
    const konfiguration = await prisma.konfiguration.findUnique({
      where: { id: konfigurationId, userId: session.user.id },
    });

    if (!konfiguration) {
      return NextResponse.json({ error: "Konfiguration nicht gefunden" }, { status: 404 });
    }

    const bestellung = await prisma.bestellung.create({
      data: {
        userId: session.user.id,
        konfigurationId,
        status: "Neu",
        bestellDatum: new Date(),
        lieferDatum: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 дней (пример)
      },
    });

    // Обновляем конфигурацию как "Bestellt"
    await prisma.konfiguration.update({
      where: { id: konfigurationId },
      data: { isBestellt: true },
    });

    return NextResponse.json({ message: "Bestellung erstellt", bestellung });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Erstellen der Bestellung" }, { status: 500 });
  }
}