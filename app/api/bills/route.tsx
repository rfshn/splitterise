import { billSchema } from "@/ValidationSchemas/Bill";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = billSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newBill = await prisma.bill.create({
    data: { ...body },
  });

  return NextResponse.json(newBill, { status: 201 });
}
