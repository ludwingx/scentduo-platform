import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border/60 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Logo */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-gold">
                <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
                ESSENCE{" "}
                <span className="text-gold group-hover:text-foreground transition-colors">
                  OS
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Plataforma inteligente de gestión de perfumerías y decants exclusivos.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm font-medium text-muted-foreground flex-wrap justify-center">
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
            <Link href="/login" className="hover:text-gold transition-colors">
              Iniciar Sesión
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2026 EssenceOS. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
