"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { submitPaymentProof } from "@/app/actions/payment-proof";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = z.object({
  customerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  customerPhone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 caracteres"),
  imageUrl: z.string().url("Debes subir una imagen del comprobante"),
  comment: z.string().optional(),
});

export default function PaymentProofPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      imageUrl: "",
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("customerName", values.customerName);
    formData.append("customerPhone", values.customerPhone);
    formData.append("imageUrl", values.imageUrl);
    formData.append("comment", values.comment || "");

    const result = await submitPaymentProof(formData);

    if (result.success) {
      toast.success(result.message);
      form.reset();
      router.push("/");
    } else {
      toast.error(result.message || "Ocurrió un error");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            Enviar Comprobante
          </CardTitle>
          <CardDescription>Sube la foto de tu transferencia QR</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono / Celular</FormLabel>
                    <FormControl>
                      <Input placeholder="77712345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprobante (Imagen)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4 border-2 border-dashed rounded-lg p-6">
                        {field.value ? (
                          <div className="relative w-full h-48">
                            <Image
                              src={field.value}
                              alt="Comprobante"
                              fill
                              className="object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => field.onChange("")}
                            >
                              Cambiar
                            </Button>
                          </div>
                        ) : (
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0]) {
                                field.onChange(res[0].url);
                                toast.success("Imagen subida correctamente");
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(`Error: ${error.message}`);
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentario (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalles adicionales..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Comprobante"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
