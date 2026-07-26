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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updatePaymentProofStatus, deletePaymentProof } from "@/app/actions/payment-proof";
import { toast } from "sonner";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, XCircle, Trash2, Search, ExternalLink, AlertTriangle, Clock } from "lucide-react";

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
  const [deletingProof, setDeletingProof] = useState<PaymentProof | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    const res = await updatePaymentProofStatus(id, status);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const confirmDelete = async () => {
    if (!deletingProof) return;
    setIsDeleting(true);
    try {
      const res = await deletePaymentProof(deletingProof.id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Error al eliminar el comprobante");
    } finally {
      setIsDeleting(false);
      setDeletingProof(null);
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
            className="h-8 text-xs font-medium"
          >
            Todos ({proofs.length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "PENDING" ? "default" : "outline"}
            onClick={() => setSelectedStatus("PENDING")}
            className="h-8 text-xs font-medium"
          >
            Pendientes ({proofs.filter((p) => p.status === "PENDING").length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "APPROVED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("APPROVED")}
            className="h-8 text-xs font-medium"
          >
            Aprobados ({proofs.filter((p) => p.status === "APPROVED").length})
          </Button>
          <Button
            size="sm"
            variant={selectedStatus === "REJECTED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("REJECTED")}
            className="h-8 text-xs font-medium"
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
              <TableHead>Comprobante</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Nota / Referencia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProofs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No se encontraron comprobantes coincidentes." : "No hay comprobantes de pago registrados."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProofs.map((proof) => (
                <TableRow key={proof.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <a
                      href={proof.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-14 w-14 rounded-lg overflow-hidden border bg-muted shrink-0 group hover:opacity-95 transition-opacity"
                    >
                      <Image
                        src={proof.imageUrl}
                        alt={`Comprobante ${proof.customerName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{proof.customerName}</span>
                      <span className="text-xs text-muted-foreground">{proof.customerPhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground italic">
                      {proof.comment || "Sin nota adicional"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(proof.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    {proof.status === "APPROVED" ? (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Aprobado
                      </Badge>
                    ) : proof.status === "REJECTED" ? (
                      <Badge variant="destructive" className="gap-1 text-[11px]">
                        <XCircle className="h-3 w-3" /> Rechazado
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1 text-[11px]">
                        <Clock className="h-3 w-3" /> Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {proof.status !== "APPROVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(proof.id, "APPROVED")}
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1 font-semibold dark:text-emerald-400 dark:hover:bg-emerald-950/40 dark:border-emerald-800"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                        </Button>
                      )}
                      {proof.status !== "REJECTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(proof.id, "REJECTED")}
                          className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 gap-1 font-semibold dark:text-amber-400 dark:hover:bg-amber-950/40 dark:border-amber-800"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Rechazar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingProof(proof)}
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

      {/* Delete Proof Confirmation Dialog */}
      <Dialog open={!!deletingProof} onOpenChange={() => setDeletingProof(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold text-lg">
              <AlertTriangle className="h-5 w-5" /> Eliminar Comprobante de Pago
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground">
              ¿Estás seguro de eliminar el comprobante de pago de{" "}
              <span className="font-bold">"{deletingProof?.customerName}"</span>?
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                Esta acción removerá el comprobante del registro.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setDeletingProof(null)}
              disabled={isDeleting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="font-bold rounded-xl gap-1.5"
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar Comprobante"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
