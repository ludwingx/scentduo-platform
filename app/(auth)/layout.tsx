import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autenticación - ScentDuo",
  description: "Inicia sesión o regístrate en ScentDuo",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black -z-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-40 pointer-events-none opacity-50" />

      {/* Logo */}
      <div className="mb-8 z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center border border-gold">
            <Image src="/logo/logo.png" alt="ScentDuo" width={48} height={48} />
          </div>
          <span className="text-3xl font-serif font-bold text-white tracking-tighter">
            SCENT <span className="text-gold">DUO</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md z-10">{children}</div>
    </div>
  );
}
