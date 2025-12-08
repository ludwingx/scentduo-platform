import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Masculino",
    href: "/catalogo?category=Masculino",
    image: PLACEHOLDER_IMAGE,
    description: "Fuerza y carácter",
  },
  {
    name: "Femenino",
    href: "/catalogo?category=Femenino",
    image: PLACEHOLDER_IMAGE,
    description: "Elegancia y sutileza",
  },
  {
    name: "Unisex",
    href: "/catalogo?category=Unisex",
    image: PLACEHOLDER_IMAGE,
    description: "Para todos los gustos",
  },
];

export default function CategoriesGrid() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
          Explora por Categoría
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Encuentra la fragancia perfecta que se adapte a tu estilo y
          personalidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative h-[400px] overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">
                {category.name}
              </h3>
              <p className="text-gray-200 mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {category.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium opacity-0 transform translate-y-4 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
                Ver colección <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
