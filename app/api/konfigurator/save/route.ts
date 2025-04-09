// app/api/konfigurator/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fahrzeugId, motorId, farbeId, felgenId, ausstattungIds, gesamtpreis } = body;

    const konfiguration = await prisma.konfiguration.create({
      data: {
        userId: session.user.id,
        fahrzeugId,
        motorId,
        farbeId,
        felgenId,
        gesamtpreis,
        ausstattungen: {
          create: ausstattungIds.map((id: string) => ({
            ausstattungId: id,
          })),
        },
      },
      include: { ausstattungen: true },
    });

    return NextResponse.json({ message: "Konfiguration gespeichert", konfiguration });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Speichern der Konfiguration" }, { status: 500 });
  }
}