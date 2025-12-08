import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StorySection() {
  return (
    <section
      id="story"
      className="py-20 bg-transparent text-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={PLACEHOLDER_IMAGE}
                alt="El arte de los decants"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            {/* Decorative elements removed - using global background */}
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
                Nuestra Historia
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                El Arte de Descubrir <br />
                <span className="text-gold">Tu Esencia Única</span>
              </h3>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                En <span className="text-white font-semibold">ScentDuo</span>,
                creemos que el lujo no debería ser inaccesible. Nuestra pasión
                por la alta perfumería nos llevó a crear una experiencia donde
                puedes explorar las fragancias más exclusivas del mundo sin
                comprometerte con una botella completa.
              </p>
              <p>
                Cada decant es preparado meticulosamente a mano, asegurando que
                la esencia llegue a ti en su estado más puro. Trabajamos solo
                con distribuidores autorizados para garantizar la autenticidad
                de cada gota.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-gold text-black hover:opacity-90 rounded-full px-8 font-bold"
                >
                  Explorar Colección
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
