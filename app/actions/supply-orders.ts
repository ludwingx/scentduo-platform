"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const supplyOrderSchema = z.object({
  providerName: z.string().min(2, "El nombre del proveedor es requerido"),
  items: z.array(
    z.object({
      productId: z.string(),
      variant: z.enum(["original", "decant-5ml", "decant-10ml"]), // Using 'original' for full bottle
      quantity: z.number().int().positive(),
      costPerUnit: z.number().positive(),
    })
  ),
});

export async function createSupplyOrder(data: any) {
  const validatedFields = supplyOrderSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { providerName, items } = validatedFields.data;

  // Calculate total cost
  const totalCost = items.reduce(
    (acc, item) => acc + item.quantity * item.costPerUnit,
    0
  );

  try {
    await prisma.supplyOrder.create({
      data: {
        providerName,
        totalCost,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variant: item.variant,
            quantity: item.quantity,
            costPerUnit: item.costPerUnit,
          })),
        },
      },
    });

    revalidatePath("/panel-admin/compras");
    revalidatePath("/panel-admin/inventario");
  } catch (error) {
    console.error("Error creating supply order:", error);
    return { success: false, message: "Error al crear la orden de compra" };
  }

  return { success: true, message: "Orden de compra creada correctamente" };
}

export async function receiveSupplyOrder(orderId: string) {
  try {
    const order = await prisma.supplyOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, message: "Orden no encontrada" };
    if (order.status === "RECEIVED")
      return { success: false, message: "La orden ya fue recibida" };

    // Transaction to update order status and update stock for each item
    await prisma.$transaction(async (tx) => {
      // 1. Update Order Status
      await tx.supplyOrder.update({
        where: { id: orderId },
        data: {
          status: "RECEIVED",
          receivedDate: new Date(),
        },
      });

      // 2. Update Stock for each item
      for (const item of order.items) {
        if (item.variant === "original") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockFull: { increment: item.quantity } },
          });
        } else if (item.variant === "decant-5ml") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockDecant5ml: { increment: item.quantity } },
          });
        } else if (item.variant === "decant-10ml") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockDecant10ml: { increment: item.quantity } },
          });
        }
      }
    });

    revalidatePath("/panel-admin/compras");
    revalidatePath("/panel-admin/inventario");
    revalidatePath("/panel-admin/productos");
    return { success: true, message: "Orden recibida y stock actualizado" };
  } catch (error) {
    console.error("Error receiving supply order:", error);
    return { success: false, message: "Error al recibir la orden" };
  }
}

export async function deleteSupplyOrder(orderId: string) {
  try {
    await prisma.supplyOrder.delete({ where: { id: orderId } });
    revalidatePath("/panel-admin/compras");
    return { success: true, message: "Orden eliminada" };
  } catch (error) {
    return { success: false, message: "Error al eliminar la orden" };
  }
}
