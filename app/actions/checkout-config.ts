"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isDemoMode } from "@/lib/demo";

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
  if (await isDemoMode()) {
    return {
      whatsappNumber: "59170000000",
      introText: "¡Hola! Quisiera realizar el siguiente pedido:",
      paymentMethods: "Efectivo / Transferencia QR / Tigo Money",
      outroText: "Gracias por tu preferencia.",
    };
  }

  try {
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
  } catch {
    return {
      whatsappNumber: "59170000000",
      introText: "¡Hola! Quisiera realizar el siguiente pedido:",
      paymentMethods: "Efectivo / Transferencia QR / Tigo Money",
      outroText: "Gracias por tu preferencia.",
    };
  }
}

export async function upsertCheckoutConfig(formData: FormData) {
  const isDemo = await isDemoMode();
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

  if (isDemo) {
    return {
      success: true,
      config: {
        id: 1,
        whatsappNumber: validated.data.whatsappNumber,
        introText: validated.data.introText || null,
        paymentMethods: validated.data.paymentMethods || null,
        outroText: validated.data.outroText || null,
      },
      message: "Configuración guardada (Modo Demo)",
    };
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
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
