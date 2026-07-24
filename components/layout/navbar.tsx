"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((m) => m.ThemeToggle),
  { ssr: false }
);

const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/catalogo" },
  { name: "Beneficios", href: "/#benefits" },
  { name: "Historia", href: "/#story" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setIsMounted(true);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-colors duration-500 py-4",
        isScrolled
          ? "bg-background/95 border-b border-border/60 shadow-lg"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button
              variant="ghost"
              size="icon"
              title="Iniciar Sesión / Admin"
              className="text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              size="icon"
              title="Iniciar Sesión"
              className="text-foreground hover:bg-accent"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
          {isMounted ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-accent"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-background/95 border-l border-border/60"
              >
                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex justify-between items-center">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> Iniciar Sesión / Admin
                    </Link>
                    <ThemeToggle />
                  </div>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
