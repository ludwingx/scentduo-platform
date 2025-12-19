'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username" className="text-gray-300">
                    Usuario
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
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
