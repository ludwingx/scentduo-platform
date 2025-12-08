import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackgroundEffects } from "./components/BackgroundEffects";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <BackgroundEffects />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
