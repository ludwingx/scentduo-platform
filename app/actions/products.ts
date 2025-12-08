"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  category: z.string().min(2, "La categoría es requerida"),
  priceDecant: z.string().optional(),
  priceFull: z.string().optional(),
  images: z.string(),
  isActive: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    priceDecant: formData.get("priceDecant"),
    priceFull: formData.get("priceFull"),
    images: formData.get("images"),
    isActive: formData.get("isActive"),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const images = validatedFields.data.images
    ? validatedFields.data.images.split(",").filter(Boolean)
    : [];

  try {
    await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        category: validatedFields.data.category,
        priceDecant: validatedFields.data.priceDecant
          ? parseFloat(validatedFields.data.priceDecant)
          : null,
        priceFull: validatedFields.data.priceFull
          ? parseFloat(validatedFields.data.priceFull)
          : null,
        images,
        isActive: validatedFields.data.isActive === "on",
      },
    });

    revalidatePath("/panel-admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "Error al crear el producto" };
  }

  redirect("/panel-admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    priceDecant: formData.get("priceDecant"),
    priceFull: formData.get("priceFull"),
    images: formData.get("images"),
    isActive: formData.get("isActive"),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const images = validatedFields.data.images
    ? validatedFields.data.images.split(",").filter(Boolean)
    : [];

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        category: validatedFields.data.category,
        priceDecant: validatedFields.data.priceDecant
          ? parseFloat(validatedFields.data.priceDecant)
          : null,
        priceFull: validatedFields.data.priceFull
          ? parseFloat(validatedFields.data.priceFull)
          : null,
        images,
        isActive: validatedFields.data.isActive === "on",
      },
    });

    revalidatePath("/panel-admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");
    revalidatePath(`/producto/${id}`);
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Error al actualizar el producto" };
  }

  redirect("/panel-admin/productos");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/panel-admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { success: true, message: "Producto eliminado correctamente" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Error al eliminar el producto" };
  }
}
