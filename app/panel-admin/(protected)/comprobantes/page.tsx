import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

async function getPaymentProofs() {
  const proofs = await prisma.paymentProof.findMany({
    orderBy: { createdAt: "desc" },
  });
  return proofs;
}

export default async function PaymentProofsPage() {
  const proofs = await getPaymentProofs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Comprobantes de Pago
        </h1>
        <p className="text-muted-foreground">
          Revisa los comprobantes enviados por tus clientes
        </p>
      </div>

      <Suspense fallback={<div>Cargando comprobantes...</div>}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Comprobante</TableHead>
                <TableHead>Comentario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proofs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No hay comprobantes registrados
                  </TableCell>
                </TableRow>
              ) : (
                proofs.map((proof) => (
                  <TableRow key={proof.id}>
                    <TableCell className="font-medium">
                      {proof.customerName}
                    </TableCell>
                    <TableCell>{proof.customerPhone}</TableCell>
                    <TableCell>
                      <a
                        href={proof.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-16 h-16 rounded-md overflow-hidden border hover:border-primary transition-colors"
                      >
                        <Image
                          src={proof.imageUrl}
                          alt="Comprobante"
                          fill
                          className="object-cover"
                        />
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {proof.comment || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          proof.status === "PENDING"
                            ? "secondary"
                            : proof.status === "APPROVED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {proof.status === "PENDING"
                          ? "Pendiente"
                          : proof.status === "APPROVED"
                          ? "Aprobado"
                          : "Rechazado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(proof.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Suspense>
    </div>
  );
}
