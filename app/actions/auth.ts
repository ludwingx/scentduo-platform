"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas.";
        default:
          return "Algo salió mal.";
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return "Faltan campos requeridos.";
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return "El usuario ya existe.";
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password, // TODO: Hash password in production
        role: "USER",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return "Error al crear usuario.";
  }

  redirect("/login?registered=true");
}

export async function loginWithProvider(provider: string) {
  await signIn(provider, { redirectTo: "/" });
}
