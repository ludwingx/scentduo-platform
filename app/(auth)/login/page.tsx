import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <Card className="border-border/5 bg-black/50 backdrop-blur-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-serif font-bold text-white">
          Bienvenido de nuevo
        </CardTitle>
        <CardDescription className="text-gray-400">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Credentials Login */}
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="grid gap-4"
        >
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
          <Button className="w-full bg-gold text-black hover:bg-gold/90 font-bold h-11">
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center">
        <div className="text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-gold hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
