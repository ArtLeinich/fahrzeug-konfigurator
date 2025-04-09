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
    const { id } = await req.json(); // Erwartet die Fahrzeug-ID im Body
    if (!id) {
      return NextResponse.json({ error: "Fahrzeug-ID fehlt" }, { status: 400 });
    }

    const deletedFahrzeug = await prisma.fahrzeug.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Fahrzeug erfolgreich gelöscht", deletedFahrzeug });
  } catch (error) {
    console.error("Fehler beim Löschen des Fahrzeugs:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Fahrzeugs" },
      { status: 500 }
    );
  }
}