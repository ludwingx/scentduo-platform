import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { KardexClient } from "./kardex-client";

export default async function KardexPage() {
  const session = await auth();
  
  return <KardexClient />;
}
