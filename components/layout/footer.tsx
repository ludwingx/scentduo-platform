import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Logo */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-gold">
                <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
                SCENT{" "}
                <span className="text-gold group-hover:text-white transition-colors">
                  DUO
                </span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs text-center md:text-left">
              Descubre tu esencia única con nuestros decants de alta perfumería.
              Lujo accesible, autenticidad garantizada.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm font-medium text-gray-300">
            <Link
              href="/catalogo"
              className="hover:text-gold transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/#benefits"
              className="hover:text-gold transition-colors"
            >
              Beneficios
            </Link>
            <Link href="/#story" className="hover:text-gold transition-colors">
              Historia
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © 2025 ScentDuo. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
