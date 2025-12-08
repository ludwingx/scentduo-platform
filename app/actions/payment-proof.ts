"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const paymentProofSchema = z.object({
  customerName: z.string().min(2, "El nombre es requerido"),
  customerPhone: z.string().min(8, "El teléfono es requerido"),
  imageUrl: z.string().url("La imagen es requerida"),
  comment: z.string().optional(),
});

export async function submitPaymentProof(formData: FormData) {
  const rawData = {
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    imageUrl: formData.get("imageUrl"),
    comment: formData.get("comment"),
  };

  const validatedFields = paymentProofSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.paymentProof.create({
      data: {
        customerName: validatedFields.data.customerName,
        customerPhone: validatedFields.data.customerPhone,
        imageUrl: validatedFields.data.imageUrl,
        comment: validatedFields.data.comment || "",
      },
    });

    revalidatePath("/panel-admin/comprobantes");
    return { success: true, message: "Comprobante enviado correctamente" };
  } catch (error) {
    console.error("Error saving payment proof:", error);
    return { success: false, message: "Error al guardar el comprobante" };
  }
}
