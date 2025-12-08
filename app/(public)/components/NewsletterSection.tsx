import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <section className="py-20 bg-primary/5 border-t border-border/50">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold tracking-tight">
            Únete al Club ScentDuo
          </h2>
          <p className="text-muted-foreground text-lg">
            Suscríbete para recibir ofertas exclusivas, lanzamientos anticipados
            y consejos de nuestros expertos perfumistas.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              className="bg-background h-12"
            />
            <Button size="lg" className="h-12 px-8">
              Suscribirse
            </Button>
          </form>
          <p className="text-xs text-muted-foreground pt-4">
            Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}
