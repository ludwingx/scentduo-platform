import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const fallbackNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX";

  try {
    const config = await prisma.checkoutConfig.findUnique({ where: { id: 1 } });

    return NextResponse.json({
      whatsappNumber: config?.whatsappNumber || fallbackNumber,
      introText: config?.introText || null,
      paymentMethods: config?.paymentMethods || null,
      outroText: config?.outroText || null,
    });
  } catch (error) {
    console.error("GET /api/checkout-config error", error);
    return NextResponse.json({
      whatsappNumber: fallbackNumber,
      introText: null,
      paymentMethods: null,
      outroText: null,
    });
  }
}
