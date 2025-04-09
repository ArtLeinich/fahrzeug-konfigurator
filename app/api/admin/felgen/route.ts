// app/api/admin/felgen/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Felgen hinzufügen" }, { status: 403 });
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const groesse = formData.get("groesse") as string;
  const design = formData.get("design") as string;
  const preis = formData.get("preis") as string;
  const image = formData.get("image") as File;

  if (!name || !groesse || !design || !preis || !image) {
    return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 });
  }

  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${image.name}`;
    const path = join(process.cwd(), "public/uploads", fileName);
    await writeFile(path, buffer);
    const bildUrl = `/uploads/${fileName}`;

    const felge = await prisma.felgen.create({
      data: {
        name,
        groesse: parseFloat(groesse),
        design,
        preis: parseFloat(preis),
        bildUrl,
      },
    });
    return NextResponse.json(felge);
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Hinzufügen der Felge" }, { status: 500 });
  }
}