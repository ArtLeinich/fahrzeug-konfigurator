// app/api/admin/farben/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Farben bearbeiten" }, { status: 403 });
  }

  const { id } = params;
  const { name, farbcode, typ, preis } = await req.json();

  try {
    const farbe = await prisma.farbe.update({
      where: { id },
      data: { name, farbcode, typ, preis: parseFloat(preis) },
    });
    return NextResponse.json(farbe);
  } catch (error) {
    console.error("Es liegt ein Fehler vor:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Farbe" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Farben löschen" }, { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.farbe.delete({ where: { id } });
    return NextResponse.json({ message: "Farbe gelöscht" });
  } catch (error) {
    console.error("Es liegt ein Fehler vor:", error);
    return NextResponse.json({ error: "Fehler beim Löschen der Farbe" }, { status: 500 });
  }
}