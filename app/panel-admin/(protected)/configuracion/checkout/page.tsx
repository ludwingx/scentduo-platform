import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";

async function getConfig() {
  const config = await prisma.checkoutConfig.findUnique({ where: { id: 1 } });

  return {
    whatsappNumber: config?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX",
    introText: config?.introText || null,
    paymentMethods: config?.paymentMethods || null,
    outroText: config?.outroText || null,
  };
}

export default async function CheckoutConfigPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/panel-admin");
  }

  if ((session.user.role || "").toUpperCase() !== "ADMIN") {
    redirect("/panel-admin/dashboard");
  }

  const initial = await getConfig();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">
            Configura el WhatsApp, textos y métodos de pago para el pedido
          </p>
        </div>

        <Link href="/panel-admin/configuracion">
          <Button type="button" variant="outline">
            Volver
          </Button>
        </Link>
      </div>

      <CheckoutForm initial={initial} />
    </div>
  );
}
