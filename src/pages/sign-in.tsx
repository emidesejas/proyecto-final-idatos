import type { Metadata } from "next";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { LabeledInput } from "@components/ui/input";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";
import SignInUpLayout from "@components/layouts/SignInUp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const SignInSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(255),
});

type SignInData = z.infer<typeof SignInSchema>;

export default function AuthenticationPage() {
  const methods = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSignUp = async (signInData: SignInData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(signInData);

    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "¡Buenas!",
      description: "Te estamos redirigiendo a la app",
    });

    await router.replace("/");
  };

  return (
    <SignInUpLayout>
      <div className="max-w-80 flex flex-col justify-center gap-3 text-center md:w-80">
        <h1 className="text-2xl font-semibold tracking-tight">
          ¡Hola de nuevo!
        </h1>
        <p className="text-muted-foreground text-sm">
          Ingresá tus credenciales para conocer más sobre tu música
        </p>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSignUp)}
            className="flex w-full flex-col items-center justify-center gap-3"
          >
            <LabeledInput
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
            />
            <LabeledInput
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="current-password"
            />
            <Button type="submit" className="w-36" loading={loading}>
              Iniciar sesión
            </Button>
          </form>
        </FormProvider>
        <div className="mt-3 flex flex-col">
          <p className="text-muted-foreground text-sm">
            ¿Todavía no tenés una cuenta?
          </p>
          <Link href="/sign-up">
            <Button variant="link" className="h-4 py-0">
              Registrate acá
            </Button>
          </Link>
        </div>
      </div>
    </SignInUpLayout>
  );
}
