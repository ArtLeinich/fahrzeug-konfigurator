import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen lang sein"),
  firstName: z.string().min(2, "Der Vorname muss mindestens 2 Zeichen lang sein"),
  lastName: z.string().min(2, "Der Nachname muss mindestens 2 Zeichen lang sein"),
  street: z.string().min(2, "Bitte geben Sie eine gültige Straße ein"),
  houseNumber: z.string().min(1, "Bitte geben Sie eine gültige Hausnummer ein"),
  postalCode: z.string().min(5, "Bitte geben Sie eine gültige Postleitzahl ein"),
  city: z.string().min(2, "Bitte geben Sie eine gültige Stadt ein"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, street, houseNumber, postalCode, city } =
      registerSchema.parse(body);

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ein Benutzer mit dieser E-Mail existiert bereits" },
        { status: 409 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);

 
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail, 
        password: hashedPassword,
        firstName,
        lastName,
        street,
        houseNumber,
        postalCode,
        city,
        role: "USER",
      },
    });

    return NextResponse.json(
      {
        message: "Registrierung erfolgreich",
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Ein Fehler ist bei der Registrierung aufgetreten" },
      { status: 500 }
    );
  }
}