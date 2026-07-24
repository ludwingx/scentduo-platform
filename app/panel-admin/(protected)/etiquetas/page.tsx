import { auth } from "@/auth";
import { LabelGeneratorClient } from "./label-generator-client";

export default async function EtiquetasPage() {
  const session = await auth();
  return <LabelGeneratorClient />;
}
