"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isDemoMode } from "@/lib/demo";

const paymentProofSchema = z.object({
  customerName: z.string().min(2, "El nombre es requerido"),
  customerPhone: z.string().min(8, "El teléfono es requerido"),
  imageUrl: z.string().url("La imagen es requerida"),
  comment: z.string().optional(),
});

export async function submitPaymentProof(formData: FormData) {
  const isDemo = await isDemoMode();
  if (isDemo) {
    return { success: true, message: "Comprobante enviado correctamente (Modo Demo)" };
  }

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

export async function updatePaymentProofStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  const isDemo = await isDemoMode();
  if (isDemo) {
    return { success: true, message: `Estado actualizado a ${status === "APPROVED" ? "Aprobado" : status === "REJECTED" ? "Rechazado" : "Pendiente"} (Modo Demo)` };
  }

  try {
    await prisma.paymentProof.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/panel-admin/comprobantes");
    revalidatePath("/panel-admin/dashboard");
    return { success: true, message: `Estado actualizado a ${status === "APPROVED" ? "Aprobado" : status === "REJECTED" ? "Rechazado" : "Pendiente"}` };
  } catch (error) {
    console.error("Error updating payment proof status:", error);
    return { success: false, message: "Error al actualizar el estado" };
  }
}

export async function deletePaymentProof(id: string) {
  const isDemo = await isDemoMode();
  if (isDemo) {
    return { success: true, message: "Comprobante eliminado correctamente (Modo Demo)" };
  }

  try {
    await prisma.paymentProof.delete({
      where: { id },
    });
    revalidatePath("/panel-admin/comprobantes");
    revalidatePath("/panel-admin/dashboard");
    return { success: true, message: "Comprobante eliminado correctamente" };
  } catch (error) {
    console.error("Error deleting payment proof:", error);
    return { success: false, message: "Error al eliminar el comprobante" };
  }
}

