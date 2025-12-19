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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createBrand, deleteBrand, updateBrand } from "@/app/actions/brands";
import { Edit, Trash2, Plus } from "lucide-react";

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
          .map((b) =>
            b.id === editingBrand.id
              ? { ...b, name: res.brand.name, slug: res.brand.slug }
              : b
          )
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

  const handleDelete = async (brand: BrandRow) => {
    if (!confirm(`¿Eliminar la marca "${brand.name}"?`)) return;

    const res = await deleteBrand(brand.id);
    if (res.success) {
      setBrands((prev) => prev.filter((b) => b.id !== brand.id));
      toast.success(res.message || "Marca eliminada");
    } else {
      toast.error(res.message || "Error al eliminar marca");
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
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Ej: Dior, Chanel"
              />
            </div>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !newBrandName.trim()}
              className="sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? "Creando..." : "Crear"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay marcas registradas
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{brand.slug}</Badge>
                  </TableCell>
                  <TableCell>{brand._count.products}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                        onClick={() => handleDelete(brand)}
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
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
            >
              {isSavingEdit ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
