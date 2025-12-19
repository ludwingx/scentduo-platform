import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./login-form";

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
        <LoginForm />
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
