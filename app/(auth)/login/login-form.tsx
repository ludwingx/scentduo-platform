'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Sparkles } from "lucide-react"

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">
                    Usuario
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
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

            <div
                className="flex min-h-8 items-end space-x-1 text-red-500"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">{errorMessage}</p>
                    </>
                )}
            </div>

            <Button
                className="w-full bg-gold text-black hover:bg-gold/90 font-bold h-11"
                disabled={isPending}
            >
                {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
        </form>
    )
}

