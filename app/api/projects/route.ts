// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createProjectSchema } from "../../../lib/validation";

export async function GET() {
  try {
    const items = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: true },
    });
    return NextResponse.json(items);
  } catch (e: any) {
    console.error("GET /api/projects error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const body = createProjectSchema.parse(payload); // ✅ validation

    const email = body.ownerEmail ?? "demo@mininghub.local";
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: "Demo User" },
    });

    const proj = await prisma.project.create({
      data: {
        title: body.title.trim(),
        summary: body.summary?.trim() || null,
        tags: body.tags ?? [],
        ownerId: user.id,
      },
      include: { owner: true },
    });

    return NextResponse.json(proj, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/projects error:", e);
    const msg = e?.issues?.[0]?.message ?? e?.message ?? "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
