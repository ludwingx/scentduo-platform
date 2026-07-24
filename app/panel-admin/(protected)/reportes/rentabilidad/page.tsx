import { auth } from "@/auth";
import { ProfitabilityClient } from "./profitability-client";

export default async function RentabilidadPage() {
  const session = await auth();
  return <ProfitabilityClient />;
}
