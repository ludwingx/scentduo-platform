import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autenticación - EssenceOS",
  description: "Inicia sesión o regístrate en EssenceOS",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background -z-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-40 pointer-events-none opacity-50" />

      {/* Logo */}
      <div className="mb-8 z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-gold/40 p-1.5 shadow-inner">
            <Image src="/logo/EssenceOSlogo.png" alt="EssenceOS" width={42} height={42} className="object-contain" />
          </div>
          <span className="text-3xl font-serif font-bold text-foreground tracking-tighter">
            ESSENCE <span className="text-gold">OS</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md z-10">{children}</div>
    </div>
  );
}
