import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { updateProjectSchema } from "../../../../lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    const payload = await req.json();
    const data = updateProjectSchema.parse(payload); // ✅ validate

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        summary: data.summary?.trim() ?? undefined,
        tags: data.tags ?? undefined,
      },
      include: { owner: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    const message = e?.issues?.[0]?.message ?? e?.message ?? "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Delete failed" }, { status: 400 });
  }
}
