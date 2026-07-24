import { auth } from "@/auth";
import { BlendsClient } from "./blends-client";

export default async function MezclasPage() {
  const session = await auth();
  const isDemo = !session?.user;
  return <BlendsClient isDemoMode={isDemo} />;
}
