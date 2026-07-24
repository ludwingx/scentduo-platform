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
        <Label htmlFor="name">
          Nombre completo
        </Label>
        <Input
          id="name"
          name="name"
          required
          className="focus-visible:ring-gold/50"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">
          Usuario
        </Label>
        <Input
          id="username"
          name="username"
          required
          className="focus-visible:ring-gold/50"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          required
          className="focus-visible:ring-gold/50"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="focus-visible:ring-gold/50"
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
