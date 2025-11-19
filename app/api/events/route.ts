// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      adminCode,
      title,
      description,
      date,
      endDate,
      location,
      country,
      url,
      organizationId,
    } = body;

    // ✅ چک کردن کد ادمین
    if (!adminCode || adminCode !== process.env.ADMIN_EVENT_CODE) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required." },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location,
        country,
        url,
        organizationId: organizationId || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
