"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-gray-300">
          Nombre completo
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Juan Pérez"
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-gold/50"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-gold/50"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-gray-300">
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="bg-white/5 border-white/10 text-white focus-visible:ring-gold/50"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 font-medium text-center bg-red-500/10 p-2 rounded border border-red-500/20">
          {errorMessage}
        </p>
      )}

      <Button
        className="w-full bg-gold text-black hover:bg-gold/90 font-bold h-11"
        disabled={isPending}
      >
        {isPending ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </form>
  );
}
