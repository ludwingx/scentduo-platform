import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import FloatingCartButton from "./(public)/components/FloatingCartButton";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="es" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${lato.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingCartButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
