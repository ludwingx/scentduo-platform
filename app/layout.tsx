import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import FloatingCartButton from "./(public)/components/FloatingCartButton";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "ScentDuo - Decants de Perfumes Exclusivos",
  description:
    "Descubre tu esencia única con nuestros decants de alta perfumería.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cinzel.variable} ${lato.variable} antialiased`}>
        {children}
        <FloatingCartButton />
        <Toaster />
      </body>
    </html>
  );
}
