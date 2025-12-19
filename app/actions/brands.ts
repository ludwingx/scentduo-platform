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

    revalidatePath("/panel-admin/productos");
    revalidatePath("/panel-admin/configuracion/marcas");
    return { success: true, brand: newBrand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return {
      success: false,
      message: "Error al crear la marca (posiblemente duplicada)",
    };
  }
}

const updateBrandSchema = z.object({
  name: z.string().min(1, "El nombre de la marca es requerido"),
});

export async function updateBrand(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
  }

  const rawData = {
    name: formData.get("name"),
  };

  const validated = updateBrandSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const name = validated.data.name as string;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const updated = await prisma.brand.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/panel-admin/productos");
    revalidatePath("/panel-admin/configuracion/marcas");
    return { success: true, brand: updated };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { success: false, message: "Error al actualizar la marca" };
  }
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
  }

  try {
    const productsCount = await prisma.product.count({ where: { brandId: id } });
    if (productsCount > 0) {
      return {
        success: false,
        message: "No se puede eliminar una marca con productos asociados",
      };
    }

    await prisma.brand.delete({ where: { id } });
    revalidatePath("/panel-admin/productos");
    revalidatePath("/panel-admin/configuracion/marcas");
    return { success: true, message: "Marca eliminada correctamente" };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, message: "Error al eliminar la marca" };
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
