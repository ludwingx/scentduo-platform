import { Truck, ShieldCheck, Heart, CreditCard } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "Envío Rápido y Seguro",
    description: "Entregas en todo el país con seguimiento en tiempo real.",
  },
  {
    icon: ShieldCheck,
    title: "100% Originales",
    description: "Garantizamos la autenticidad de cada fragancia y decant.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    description: "Asesoramiento experto para encontrar tu aroma ideal.",
  },
  {
    icon: CreditCard,
    title: "Pagos Flexibles",
    description: "Múltiples métodos de pago seguros y confiables.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-16 bg-muted/30 border-y border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-background hover:shadow-sm transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="font-serif font-bold text-lg">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
