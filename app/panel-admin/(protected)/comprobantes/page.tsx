import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PaymentProofsClient } from "./payment-proofs-client";
import { isDemoMode, MOCK_PROOFS } from "@/lib/demo";

async function getPaymentProofs() {
  if (await isDemoMode()) return MOCK_PROOFS;

  try {
    return await prisma.paymentProof.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return MOCK_PROOFS;
  }
}

export default async function PaymentProofsPage() {
  const proofs = await getPaymentProofs();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Comprobantes de Pago
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifica los comprobantes bancarios y transferencias enviadas por clientes
        </p>
      </div>

      <Suspense fallback={<div>Cargando comprobantes...</div>}>
        <PaymentProofsClient proofs={proofs} />
      </Suspense>
    </div>
  );
}
