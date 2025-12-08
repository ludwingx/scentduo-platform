import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { QrCode, ArrowRight } from "lucide-react";

export default function QRPaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif font-bold text-primary">
            Pago con QR
          </CardTitle>
          <CardDescription>
            Escanea el código para realizar tu pago
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center w-64 h-64 bg-white rounded-lg p-4">
            {/* Placeholder for QR Code */}
            <QrCode className="w-48 h-48 text-black" />
            <span className="absolute text-xs text-black font-mono mt-40">
              QR DE EJEMPLO
            </span>
          </div>

          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>Banco: Banco Nacional de Bolivia</p>
            <p>Cuenta: 123456789</p>
            <p>Titular: ScentDuo S.R.L.</p>
          </div>

          <div className="w-full pt-4">
            <Link href="/enviar-comprobante">
              <Button className="w-full" size="lg">
                Ya pagué, enviar comprobante{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
