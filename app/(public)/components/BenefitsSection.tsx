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
      className="py-16 bg-card/30 backdrop-blur-sm border-y border-gold/15"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-transparent hover:border-gold/30 hover:bg-card/80 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
            >
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-gold border border-gold/20 shadow-inner">
                <benefit.icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">{benefit.title}</h3>
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
