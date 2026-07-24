import { RegisterForm } from "./register-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Card className="border-border bg-card shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-serif font-bold text-card-foreground">
          Crear Cuenta
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Únete a EssenceOS para acceder al panel y catálogo exclusivo
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center">
        <div className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-gold hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
