"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updatePaymentProofStatus, deletePaymentProof } from "@/app/actions/payment-proof";
import { toast } from "sonner";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, XCircle, Trash2, Search, ExternalLink } from "lucide-react";

interface PaymentProof {
  id: string;
  customerName: string;
  customerPhone: string;
  imageUrl: string;
  comment: string | null;
  status: string;
  createdAt: Date;
}

export function PaymentProofsClient({ proofs }: { proofs: PaymentProof[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    const res = await updatePaymentProofStatus(id, status);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este comprobante de pago?")) {
      const res = await deletePaymentProof(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }
  };

  const filteredProofs = proofs.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-3 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <Button
            size="sm"
            variant={selectedStatus === "ALL" ? "default" : "outline"}
            onClick={() => setSelectedStatus("ALL")}
            className="h-8 text-xs"
          >
            Todos ({proofs.length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "PENDING" ? "default" : "outline"}
            onClick={() => setSelectedStatus("PENDING")}
            className="h-8 text-xs"
          >
            Pendientes ({proofs.filter((p) => p.status === "PENDING").length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "APPROVED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("APPROVED")}
            className="h-8 text-xs"
          >
            Aprobados ({proofs.filter((p) => p.status === "APPROVED").length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "REJECTED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("REJECTED")}
            className="h-8 text-xs"
          >
            Rechazados ({proofs.filter((p) => p.status === "REJECTED").length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono WhatsApp</TableHead>
              <TableHead>Comprobante</TableHead>
              <TableHead>Comentario / Nota</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Recibido</TableHead>
              <TableHead className="text-right">Acciones de Verificación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProofs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No hay comprobantes que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              filteredProofs.map((proof) => (
                <TableRow key={proof.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-sm">
                    {proof.customerName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {proof.customerPhone}
                  </TableCell>
                  <TableCell>
                    <a
                      href={proof.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block w-14 h-14 rounded-lg overflow-hidden border hover:border-primary transition-colors bg-muted"
                      title="Ver comprobante original"
                    >
                      <Image
                        src={proof.imageUrl}
                        alt="Comprobante"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground truncate">
                    {proof.comment || "Sin nota adicional"}
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
                      className="text-[11px]"
                    >
                      {proof.status === "PENDING"
                        ? "Pendiente"
                        : proof.status === "APPROVED"
                        ? "Aprobado"
                        : "Rechazado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(proof.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {proof.status !== "APPROVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(proof.id, "APPROVED")}
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                        </Button>
                      )}
                      {proof.status !== "REJECTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(proof.id, "REJECTED")}
                          className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Rechazar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(proof.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
