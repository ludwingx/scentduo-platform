"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createBrand, deleteBrand, updateBrand } from "@/app/actions/brands";
import { Edit, Trash2, Plus, AlertTriangle } from "lucide-react";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
};

export function BrandsManager({ initialBrands }: { initialBrands: BrandRow[] }) {
  const [brands, setBrands] = useState<BrandRow[]>(initialBrands);
  const [newBrandName, setNewBrandName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingBrand, setEditingBrand] = useState<BrandRow | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingBrand, setDeletingBrand] = useState<BrandRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalBrands = useMemo(() => brands.length, [brands.length]);

  const handleCreate = async () => {
    const name = newBrandName.trim();
    if (!name) return;

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      const res = await createBrand(formData);
      if (!res.success || !res.brand) {
        toast.error(res.message || "Error al crear marca");
        return;
      }

      const newRow: BrandRow = {
        id: res.brand.id,
        name: res.brand.name,
        slug: res.brand.slug,
        _count: { products: 0 },
      };

      setBrands((prev) => [newRow, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      setNewBrandName("");
      toast.success("Marca creada");
    } catch {
      toast.error("Error al crear marca");
    } finally {
      setIsCreating(false);
    }
  };

  const openEdit = (brand: BrandRow) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand) return;

    const name = editName.trim();
    if (!name) return;

    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      const res = await updateBrand(editingBrand.id, formData);
      if (!res.success || !res.brand) {
        toast.error(res.message || "Error al actualizar marca");
        return;
      }

      setBrands((prev) =>
        prev
          .map((b) => (b.id === editingBrand.id ? { ...b, name: res.brand!.name, slug: res.brand!.slug } : b))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success("Marca actualizada");
      setIsEditOpen(false);
      setEditingBrand(null);
    } catch {
      toast.error("Error al actualizar marca");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const confirmDeleteBrand = async () => {
    if (!deletingBrand) return;
    setIsDeleting(true);
    try {
      const res = await deleteBrand(deletingBrand.id);
      if (res.success) {
        setBrands((prev) => prev.filter((b) => b.id !== deletingBrand.id));
        toast.success(res.message || "Marca eliminada");
      } else {
        toast.error(res.message || "Error al eliminar marca");
      }
    } catch {
      toast.error("Error al eliminar marca");
    } finally {
      setIsDeleting(false);
      setDeletingBrand(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{totalBrands}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="brandName">Nueva marca</Label>
              <Input
                id="brandName"
                placeholder="Ej: Armaf"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !newBrandName.trim()}
              className="gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Creando..." : "Agregar Marca"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Productos asociados</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No hay marcas registradas.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-sm">{brand.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{brand.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {brand._count?.products ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(brand)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingBrand(brand)}
                        title="Eliminar"
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

      {/* Edit Brand Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ej: Dior"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSavingEdit || !editName.trim()}
              className="rounded-xl font-bold"
            >
              {isSavingEdit ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Brand Dialog */}
      <Dialog open={!!deletingBrand} onOpenChange={() => setDeletingBrand(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold text-lg">
              <AlertTriangle className="h-5 w-5" /> Eliminar Marca
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground">
              ¿Estás seguro de eliminar la marca{" "}
              <span className="font-bold">"{deletingBrand?.name}"</span>?
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                No se pueden eliminar marcas que tengan perfumes asociados en el catálogo.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setDeletingBrand(null)}
              disabled={isDeleting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteBrand}
              disabled={isDeleting}
              className="font-bold rounded-xl gap-1.5"
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar Marca"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
