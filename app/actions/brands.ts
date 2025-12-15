"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const brandSchema = z.object({
  name: z.string().min(1, "El nombre de la marca es requerido"),
  slug: z.string().min(1, "El slug es requerido").optional(), // We'll generate it if missing
});

export async function createBrand(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
  }

  const name = formData.get("name") as string;

  if (!name) {
    return { success: false, message: "Nombre de marca requerido" };
  }

  // Simple slug generation
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const newBrand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    revalidatePath("/panel-admin/productos"); // Revalidate where the selector might be used
    return { success: true, brand: newBrand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return {
      success: false,
      message: "Error al crear la marca (posiblemente duplicada)",
    };
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return brands;
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return [];
  }
}
