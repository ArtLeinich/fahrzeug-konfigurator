// app/api/konfigurator/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { id } = params;

  try {
    // Prüfen, ob die Konfiguration dem Benutzer gehört
    const konfiguration = await prisma.konfiguration.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!konfiguration) {
      return NextResponse.json({ error: "Konfiguration nicht gefunden" }, { status: 404 });
    }

    // Verknüpfte Datensätze in der Tabelle KonfigurationAusstattung löschen
    await prisma.konfigurationAusstattung.deleteMany({
      where: { konfigurationId: id },
    });


    await prisma.konfiguration.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Konfiguration gelöscht" });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen der Konfiguration" }, { status: 500 });
  }
}