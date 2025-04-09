// app/api/admin/felgen/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  console.log("Session in PUT:", session); 

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Felgen bearbeiten" }, { status: 403 });
  }

  const { id } = params;
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const groesse = formData.get("groesse") as string;
  const design = formData.get("design") as string;
  const preis = formData.get("preis") as string;
  const image = formData.get("image") as File | null;

  console.log("Received FormData:", { name, groesse, design, preis, image: image?.name }); 

  try {
    const existingFelge = await prisma.felgen.findUnique({ where: { id } });
    if (!existingFelge) {
      return NextResponse.json({ error: "Felge nicht gefunden" }, { status: 404 });
    }

    let bildUrl = existingFelge.bildUrl;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
      const path = join(process.cwd(), "public/uploads", fileName);
      await writeFile(path, buffer);
      bildUrl = `/uploads/${fileName}`;
      console.log("New image saved:", bildUrl); 
    }

    const felge = await prisma.felgen.update({
      where: { id },
      data: {
        name,
        groesse: parseFloat(groesse),
        design,
        preis: parseFloat(preis),
        bildUrl,
      },
    });
    console.log("Updated felge in DB:", felge); 
    return NextResponse.json(felge);
  } catch (error) {
    console.error("Error updating felge:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Felge" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  console.log("Session in DELETE:", session);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Felgen löschen" }, { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.felgen.delete({ where: { id } });
    return NextResponse.json({ message: "Felge gelöscht" });
  } catch (error) {
    console.error("Error deleting felge:", error);
    return NextResponse.json({ error: "Fehler beim Löschen der Felge" }, { status: 500 });
  }
}