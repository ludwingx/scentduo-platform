"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
// We import the type, but the actual component is imported dynamically below
import { ProductForm as ProductFormType } from "./product-form";

// Dynamically import ProductForm with ssr: false
// This works here because this file is a Client Component ("use client")
const ProductFormNoSSR = dynamic(
  () => import("./product-form").then((mod) => mod.ProductForm),
  { ssr: false }
);

export function ProductFormWrapper(
  props: ComponentProps<typeof ProductFormType>
) {
  return <ProductFormNoSSR {...props} />;
}
