import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";
import { isDemoMode } from "@/lib/demo";

const MOCK_CHECKOUT_CONFIG = {
  whatsappNumber: "59170000000",
  introText: "¡Hola! Quisiera realizar el siguiente pedido en EssenceOS:",
  paymentMethods: "Transferencia Bancaria QR (Banco Unión / BNB) / Tigo Money",
  outroText: "Por favor envíanos la captura de tu pago para procesar el envío inmediato.",
};

async function getConfig() {
  if (await isDemoMode()) return MOCK_CHECKOUT_CONFIG;

  try {
    const config = await prisma.checkoutConfig.findUnique({ where: { id: 1 } });
    return {
      whatsappNumber: config?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59170000000",
      introText: config?.introText || null,
      paymentMethods: config?.paymentMethods || null,
      outroText: config?.outroText || null,
    };
  } catch {
    return MOCK_CHECKOUT_CONFIG;
  }
}

export default async function CheckoutConfigPage() {
  const isDemo = await isDemoMode();

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) {
      redirect("/panel-admin");
    }

    if ((session.user.role || "").toUpperCase() !== "ADMIN") {
      redirect("/panel-admin/dashboard");
    }
  }

  const initial = await getConfig();
  const backLink = isDemo ? "/demo/panel-admin/configuracion" : "/panel-admin/configuracion";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">
            Configura el WhatsApp, textos y métodos de pago para el pedido
          </p>
        </div>

        <Link href={backLink}>
          <Button type="button" variant="outline">
            Volver
          </Button>
        </Link>
      </div>

      <CheckoutForm initial={initial} />
    </div>
  );
}
