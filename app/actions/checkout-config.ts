"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const checkoutConfigSchema = z.object({
  whatsappNumber: z.string().min(1, "WhatsApp es requerido"),
  introText: z.string().optional(),
  paymentMethods: z.string().optional(),
  outroText: z.string().optional(),
});

export type CheckoutConfigDTO = {
  whatsappNumber: string;
  introText: string | null;
  paymentMethods: string | null;
  outroText: string | null;
};

export async function getCheckoutConfig(): Promise<CheckoutConfigDTO> {
  const config = await prisma.checkoutConfig.findUnique({ where: { id: 1 } });

  if (!config) {
    return {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX",
      introText: null,
      paymentMethods: null,
      outroText: null,
    };
  }

  return {
    whatsappNumber:
      config.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX",
    introText: config.introText,
    paymentMethods: config.paymentMethods,
    outroText: config.outroText,
  };
}

export async function upsertCheckoutConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
  }

  const rawData = {
    whatsappNumber: formData.get("whatsappNumber"),
    introText: formData.get("introText"),
    paymentMethods: formData.get("paymentMethods"),
    outroText: formData.get("outroText"),
  };

  const validated = checkoutConfigSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await prisma.checkoutConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        whatsappNumber: validated.data.whatsappNumber,
        introText: validated.data.introText || null,
        paymentMethods: validated.data.paymentMethods || null,
        outroText: validated.data.outroText || null,
      },
      update: {
        whatsappNumber: validated.data.whatsappNumber,
        introText: validated.data.introText || null,
        paymentMethods: validated.data.paymentMethods || null,
        outroText: validated.data.outroText || null,
      },
    });

    revalidatePath("/panel-admin/configuracion/checkout");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return { success: true, config: updated };
  } catch (error) {
    console.error("Error saving checkout config:", error);
    return { success: false, message: "Error al guardar configuración" };
  }
}
