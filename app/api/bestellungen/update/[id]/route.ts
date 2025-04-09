// app/api/bestellungen/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = params;
  const { status } = await req.json();

  try {
    const bestellung = await prisma.bestellung.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: "Status aktualisiert", bestellung });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Status" }, { status: 500 });
  }
}