"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CartItem {
  productId: string;
  variant: "original" | "decant-5ml" | "decant-10ml";
  quantity: number;
  price: number;
}

export async function processPosOrder(
  cartItems: CartItem[],
  totalAmount: number
) {
  if (cartItems.length === 0) {
    return { success: false, message: "El carrito está vacío" };
  }

  try {
    // Generate simple Order Number (e.g., POS-Timestamp)
    const orderNumber = `POS-${Date.now()}`;

    await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: "Cliente Mostrador",
          customerPhone: "",
          totalAmount,
          status: "DELIVERED", // POS orders are immediate
          paymentStatus: "PAID",
          paidAt: new Date(),
          deliveredAt: new Date(),
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              variant: item.variant,
              quantity: item.quantity,
              pricePerUnit: item.price,
              subtotal: item.quantity * item.price,
              status: "DELIVERED",
            })),
          },
        },
      });

      // 2. Decrement Stock
      for (const item of cartItems) {
        if (item.variant === "original") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockFull: { decrement: item.quantity } },
          });
        } else if (item.variant === "decant-5ml") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockDecant5ml: { decrement: item.quantity } },
          });
        } else if (item.variant === "decant-10ml") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockDecant10ml: { decrement: item.quantity } },
          });
        }
      }
    });

    revalidatePath("/panel-admin/inventario");
    revalidatePath("/panel-admin/dashboard");
    return { success: true, message: "Venta registrada correctamente" };
  } catch (error) {
    console.error("POS Error:", error);
    return { success: false, message: "Error al procesar la venta" };
  }
}
