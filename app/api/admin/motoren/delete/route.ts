import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.motor.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Motor gelöscht" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}