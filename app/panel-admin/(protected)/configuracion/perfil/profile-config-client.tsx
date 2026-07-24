"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, Save, KeyRound } from "lucide-react";

export function ProfileConfigClient({
  user,
}: {
  user: { name: string; email: string };
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Perfil actualizado correctamente");
    }, 600);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Contraseña actualizada con éxito");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <form onSubmit={handleUpdateProfile}>
        <Card className="shadow-sm border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Información de Usuario</CardTitle>
            </div>
            <CardDescription>Nombre e identificador de acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" /> Guardar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handleChangePassword}>
        <Card className="shadow-sm border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <CardTitle>Seguridad & Cambio de Contraseña</CardTitle>
            </div>
            <CardDescription>Actualiza tu clave secreta de acceso al panel admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Contraseña Actual</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Nueva Contraseña</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirmar Nueva Contraseña</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSaving} variant="outline" className="gap-2 border-amber-300">
                <KeyRound className="h-4 w-4 text-amber-600" /> Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
