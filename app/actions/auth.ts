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
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name || !username) {
    return "Faltan campos requeridos.";
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return "El email ya está registrado.";
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return "El nombre de usuario ya está en uso.";
    }

    const adminEmails = (
      process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ""
    )
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const usersCount = await prisma.user.count();
    const isAdmin = adminEmails.includes(email.toLowerCase()) || usersCount === 0;

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password, // TODO: Hash password in production
        role: isAdmin ? "ADMIN" : "USER",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return "Error al crear usuario.";
  }

  redirect("/login?registered=true");
}
