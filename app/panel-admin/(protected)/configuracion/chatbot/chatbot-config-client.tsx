"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Code,
  Send,
  Cpu,
  AlertTriangle,
} from "lucide-react";

export function ChatbotConfigClient() {
  const [apiKey, setApiKey] = useState("essenceos_live_8f93a17b4c9201e5d8a");
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://tu-servidor-externo.com/webhook/essenceos");
  const [isTesting, setIsTesting] = useState(false);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copiada al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmRegenerateKey = () => {
    const newKey =
      "essenceos_live_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    setIsRegenerateOpen(false);
    toast.success("Nueva API Key generada con éxito");
  };

  const handleSaveWebhook = () => {
    toast.success("URL de Webhook actualizada correctamente");
  };

  const handleTestWebhook = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast.success("Prueba de webhook enviada con éxito (HTTP 200 OK)");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="bg-linear-to-r from-slate-900 to-slate-800 text-white border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-gold shrink-0">
              <Cpu className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">EssenceOS Headless API Engine</h2>
                <Badge variant="success" className="text-xs">
                  API v1 Activa
                </Badge>
              </div>
              <p className="text-sm text-slate-300">
                Acceso por API para tus aplicaciones externas, chatbots y sistemas de automatización. Consume el catálogo de fragancias, consulta fraccionamiento de decants y sincroniza pedidos en tiempo real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Credentials Card */}
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Credenciales de API (Bearer Token)</CardTitle>
          </div>
          <CardDescription>
            Utiliza esta clave en el encabezado Authorization: Bearer TOKEN para autenticar peticiones externas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Secret Key</Label>
            <div className="flex items-center gap-2">
              <Input value={apiKey} readOnly className="font-mono text-sm bg-muted" />
              <Button variant="outline" onClick={handleCopyKey} className="gap-2">
                {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRegenerateOpen(true)}
                title="Regenerar Token"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration Card */}
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>Configuración de Webhooks en Tiempo Real</CardTitle>
          </div>
          <CardDescription>
            Recibe notificaciones HTTP POST automáticas cuando se confirme una venta o ingrese un nuevo pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL de Webhook (Endpoint Externo)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://..."
                className="font-mono text-sm"
              />
              <Button onClick={handleSaveWebhook} className="shrink-0 font-semibold">
                Guardar URL
              </Button>
              <Button
                variant="outline"
                onClick={handleTestWebhook}
                disabled={isTesting}
                className="shrink-0 gap-2 font-semibold"
              >
                <Send className="h-4 w-4" />
                {isTesting ? "Enviando..." : "Probar Webhook"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints Reference */}
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Documentación de Endpoints Disponibles</CardTitle>
          </div>
          <CardDescription>Rutas públicas autenticadas para tu bot de WhatsApp o Telegram</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Badge variant="success" className="font-bold">
                    GET
                  </Badge>
                  <span className="font-semibold text-foreground">/api/v1/products</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Catálogo Completo</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Retorna la lista de perfumes con marcas, precios de botellas y decants (5ml / 10ml), stock y notas olfativas.
              </p>
              <div className="bg-muted p-2 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto">
                Filtros soportados: ?search=citrico &brand=Afnan &family=Amaderada
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Badge variant="info" className="font-bold">
                    POST
                  </Badge>
                  <span className="font-semibold text-foreground">/api/v1/checkout-config</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Info Tienda</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Obtiene los números de cuentas bancarias QR y textos para cerrar la venta en WhatsApp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regenerate Key Confirmation Dialog */}
      <Dialog open={isRegenerateOpen} onOpenChange={setIsRegenerateOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg">
              <AlertTriangle className="h-5 w-5" /> Regenerar API Key
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground">
              ¿Estás seguro de regenerar la clave secreta de API?
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                Las aplicaciones o chatbots externos actualmente conectados dejarán de funcionar hasta que actualicen su encabezado Bearer token.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsRegenerateOpen(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmRegenerateKey}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold rounded-xl gap-1.5"
            >
              Regenerar Clave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
