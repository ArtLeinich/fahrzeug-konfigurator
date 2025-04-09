import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const { id } = await req.json(); // Erwartet die Bestellungs-ID im Body
    if (!id) {
      return NextResponse.json({ error: "Bestellungs-ID fehlt" }, { status: 400 });
    }

    const deletedBestellung = await prisma.bestellung.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bestellung erfolgreich gelöscht", deletedBestellung });
  } catch (error) {
    console.error("Fehler beim Löschen der Bestellung:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Bestellung" },
      { status: 500 }
    );
  }
}