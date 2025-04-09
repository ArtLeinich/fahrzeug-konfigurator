// app/api/profil/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { firstName, lastName, email } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName, email },
    });

    return NextResponse.json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Profils" }, { status: 500 });
  }
}