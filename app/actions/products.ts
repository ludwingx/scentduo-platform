"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Schema for form validation
const productSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  category: z.string().min(2, "La categoría es requerida"),
  // New fields
  brandId: z.string().optional(),
  olfactoryFamily: z.string().optional(),
  topNotes: z.string().optional(),
  heartNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  concentration: z.string().optional(),
  gender: z.string().optional(),
  season: z.string().optional(),
  occasion: z.string().optional(),

  // Pricing & Availability
  hasDecant: z.string().optional(),
  priceDecant5ml: z.string().optional(),
  priceDecant10ml: z.string().optional(),
  hasFullBottle: z.string().optional(),
  priceFull: z.string().optional(),
  // Metadata
  images: z.string(),
  isActive: z.string().optional(),
  isFeatured: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    brandId: formData.get("brandId") || undefined, // Handle empty string
    olfactoryFamily: formData.get("olfactoryFamily"),
    topNotes: formData.get("topNotes"),
    heartNotes: formData.get("heartNotes"),
    baseNotes: formData.get("baseNotes"),
    concentration: formData.get("concentration"),
    gender: formData.get("gender"),
    season: formData.get("season"),
    occasion: formData.get("occasion"),

    hasDecant: formData.get("hasDecant"),
    priceDecant5ml: formData.get("priceDecant5ml"),
    priceDecant10ml: formData.get("priceDecant10ml"),
    hasFullBottle: formData.get("hasFullBottle"),
    priceFull: formData.get("priceFull"),
    images: formData.get("images"),
    isActive: formData.get("isActive"),
    isFeatured: formData.get("isFeatured"),
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
        brandId: validatedFields.data.brandId,
        olfactoryFamily: validatedFields.data.olfactoryFamily,
        topNotes: validatedFields.data.topNotes,
        heartNotes: validatedFields.data.heartNotes,
        baseNotes: validatedFields.data.baseNotes,
        concentration: validatedFields.data.concentration,
        gender: validatedFields.data.gender,
        season: validatedFields.data.season,
        occasion: validatedFields.data.occasion,

        hasDecant: validatedFields.data.hasDecant === "on",
        priceDecant5ml: validatedFields.data.priceDecant5ml
          ? parseFloat(validatedFields.data.priceDecant5ml)
          : null,
        priceDecant10ml: validatedFields.data.priceDecant10ml
          ? parseFloat(validatedFields.data.priceDecant10ml)
          : null,

        hasFullBottle: validatedFields.data.hasFullBottle === "on",
        priceFull: validatedFields.data.priceFull
          ? parseFloat(validatedFields.data.priceFull)
          : null,

        images,
        isActive: validatedFields.data.isActive === "on",
        isFeatured: validatedFields.data.isFeatured === "on",
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
  const session = await auth();
  const userId = session?.user?.id;

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    brandId: formData.get("brandId") || undefined,
    olfactoryFamily: formData.get("olfactoryFamily"),
    topNotes: formData.get("topNotes"),
    heartNotes: formData.get("heartNotes"),
    baseNotes: formData.get("baseNotes"),
    concentration: formData.get("concentration"),
    gender: formData.get("gender"),
    season: formData.get("season"),
    occasion: formData.get("occasion"),

    hasDecant: formData.get("hasDecant"),
    priceDecant5ml: formData.get("priceDecant5ml"),
    priceDecant10ml: formData.get("priceDecant10ml"),
    hasFullBottle: formData.get("hasFullBottle"),
    priceFull: formData.get("priceFull"),
    images: formData.get("images"),
    isActive: formData.get("isActive"),
    isFeatured: formData.get("isFeatured"),
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
    const currentProduct = await prisma.product.findUnique({ where: { id } });
    if (!currentProduct) throw new Error("Producto no encontrado");

    // Prepare new values
    const newPriceFull = validatedFields.data.priceFull
      ? parseFloat(validatedFields.data.priceFull)
      : null;
    const newPriceDecant5ml = validatedFields.data.priceDecant5ml
      ? parseFloat(validatedFields.data.priceDecant5ml)
      : null;
    const newPriceDecant10ml = validatedFields.data.priceDecant10ml
      ? parseFloat(validatedFields.data.priceDecant10ml)
      : null;

    await prisma.$transaction(async (tx) => {
      // 1. Log Price Changes
      if (Number(currentProduct.priceFull) !== Number(newPriceFull)) {
        await tx.productPriceHistory.create({
          data: {
            productId: id,
            priceType: "FULL",
            oldPrice: currentProduct.priceFull,
            newPrice: newPriceFull ? newPriceFull : null,
            changedById: userId,
          },
        });
      }
      if (Number(currentProduct.priceDecant5ml) !== Number(newPriceDecant5ml)) {
        await tx.productPriceHistory.create({
          data: {
            productId: id,
            priceType: "DECANT_5ML",
            oldPrice: currentProduct.priceDecant5ml,
            newPrice: newPriceDecant5ml ? newPriceDecant5ml : null,
            changedById: userId,
          },
        });
      }
      if (
        Number(currentProduct.priceDecant10ml) !== Number(newPriceDecant10ml)
      ) {
        await tx.productPriceHistory.create({
          data: {
            productId: id,
            priceType: "DECANT_10ML",
            oldPrice: currentProduct.priceDecant10ml,
            newPrice: newPriceDecant10ml ? newPriceDecant10ml : null,
            changedById: userId,
          },
        });
      }

      // 2. Update Product
      await tx.product.update({
        where: { id },
        data: {
          name: validatedFields.data.name,
          description: validatedFields.data.description,
          category: validatedFields.data.category,
          brandId: validatedFields.data.brandId,
          olfactoryFamily: validatedFields.data.olfactoryFamily,
          topNotes: validatedFields.data.topNotes,
          heartNotes: validatedFields.data.heartNotes,
          baseNotes: validatedFields.data.baseNotes,
          concentration: validatedFields.data.concentration,
          gender: validatedFields.data.gender,
          season: validatedFields.data.season,
          occasion: validatedFields.data.occasion,

          hasDecant: validatedFields.data.hasDecant === "on",
          priceDecant5ml: newPriceDecant5ml,
          priceDecant10ml: newPriceDecant10ml,

          hasFullBottle: validatedFields.data.hasFullBottle === "on",
          priceFull: newPriceFull,

          images,
          isActive: validatedFields.data.isActive === "on",
          isFeatured: validatedFields.data.isFeatured === "on",
        },
      });
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
