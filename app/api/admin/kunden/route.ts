import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

function generateRandomPassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        konfigurationen: {
          where: {
            isBestellt: true,
          },
          select: { id: true },
        },
      },
    });

    const formattedUsers = users.map((user) => ({
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
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden der Nutzer" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { firstName, lastName, email, street, houseNumber, postalCode, city } = await req.json();

  try {
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "USER",
        street,
        houseNumber,
        postalCode,
        city,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      street: newUser.street,
      houseNumber: newUser.houseNumber,
      postalCode: newUser.postalCode,
      city: newUser.city,
      orderCount: 0,
      createdAt: newUser.createdAt.toISOString(),
      generatedPassword: plainPassword,
    });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Erstellen des Nutzers" }, { status: 500 });
  }
}