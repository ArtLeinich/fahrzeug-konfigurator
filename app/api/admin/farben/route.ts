// app/api/admin/farben/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Farben hinzufügen" }, { status: 403 });
  }

  const { name, farbcode, typ, preis } = await req.json();

  try {
    const farbe = await prisma.farbe.create({
      data: { name, farbcode, typ, preis: parseFloat(preis) },
    });
    return NextResponse.json(farbe);
  } catch (error) {
    console.error("Es liegt ein Fehler vor:", error);
    return NextResponse.json({ error: "Fehler beim Hinzufügen der Farbe" }, { status: 500 });
  }
}