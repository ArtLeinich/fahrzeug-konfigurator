import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(process.cwd(), "public/uploads", file.name);
  
  await writeFile(filePath, buffer);

  const updatedFahrzeug = await prisma.fahrzeug.update({
    where: { id: params.id },
    data: { bildUrl: `/uploads/${file.name}` },
  });

  return NextResponse.json(updatedFahrzeug);
}
