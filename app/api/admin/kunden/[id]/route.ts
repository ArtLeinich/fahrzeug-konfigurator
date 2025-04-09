import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        konfigurationen: {
          where: {
            isBestellt: true,
          },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }

    const formattedUser = {
      id: user.id,
      firstName: user.firstName || "", 
      lastName: user.lastName || "",  
      email: user.email,
      street: user.street,           
      houseNumber: user.houseNumber, 
      postalCode: user.postalCode,  
      city: user.city,              
      orderCount: user.konfigurationen.length,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden des Nutzers" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = params;
  const { firstName, lastName, email, street, houseNumber, postalCode, city } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email, street, houseNumber, postalCode, city },
    });

    const konfigurationen = await prisma.konfiguration.findMany({
      where: { userId: id, isBestellt: true },
    });
    const orderCount = konfigurationen.length;

    return NextResponse.json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      street: updatedUser.street,
      houseNumber: updatedUser.houseNumber,
      postalCode: updatedUser.postalCode,
      city: updatedUser.city,
      orderCount,
      createdAt: updatedUser.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Nutzers" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Nutzer gelöscht" });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen des Nutzers" }, { status: 500 });
  }
}