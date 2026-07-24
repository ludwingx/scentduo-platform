import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const family = searchParams.get("family");

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { olfactoryFamily: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { topNotes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (brand) {
      where.brand = { name: { equals: brand, mode: "insensitive" } };
    }

    if (family) {
      where.olfactoryFamily = { contains: family, mode: "insensitive" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        brand: { select: { name: true } },
        olfactoryFamily: true,
        concentration: true,
        gender: true,
        notes: true,
        topNotes: true,
        heartNotes: true,
        baseNotes: true,
        longevity: true,
        sillage: true,
        images: true,
        hasFullBottle: true,
        priceFull: true,
        stockFull: true,
        hasDecant: true,
        priceDecant5ml: true,
        stockDecant5ml: true,
        priceDecant10ml: true,
        stockDecant10ml: true,
        allowReservation: true,
        estimatedRestockDays: true,
      },
    });

    return NextResponse.json({
      status: "success",
      count: products.length,
      data: products.map((p) => ({
        ...p,
        brandName: p.brand?.name || null,
        priceFull: p.priceFull ? Number(p.priceFull) : null,
        priceDecant5ml: p.priceDecant5ml ? Number(p.priceDecant5ml) : null,
        priceDecant10ml: p.priceDecant10ml ? Number(p.priceDecant10ml) : null,
      })),
    });
  } catch (error) {
    console.error("Error in API GET /api/v1/products:", error);
    return NextResponse.json(
      { status: "error", message: "Error al consultar el catálogo de perfumes" },
      { status: 500 }
    );
  }
}
