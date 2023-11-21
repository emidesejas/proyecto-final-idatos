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

const SignUpSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(255),
});

type SignUpData = z.infer<typeof SignUpSchema>;

export default function AuthenticationPage() {
  const methods = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
  });

  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSignUp = async (signUpData: SignUpData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp(signUpData);

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
      title: "¡Registro exitoso!",
      description: "¡Gracias por unirte! Te estamos redirigiendo a la app",
    });

    await router.replace("/");
  };

  return (
    <SignInUpLayout>
      <div className="max-w-80 flex flex-col justify-center gap-3 text-center md:w-80">
        <h1 className="text-2xl font-semibold tracking-tight">
          ¡Creá tu cuenta!
        </h1>
        <p className="text-muted-foreground text-sm">
          Ingresá tu email y una contraseña para unirte a nuestra plataforma
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
              autoComplete="new-password"
            />
            <Button type="submit" className="w-36" loading={loading}>
              Registrarte
            </Button>
          </form>
        </FormProvider>
        <div className="mt-3 flex flex-col">
          <p className="text-muted-foreground text-sm">¿Ya tenés una cuenta?</p>
          <Link href="/sign-in">
            <Button variant="link" className="h-4 py-0">
              Iniciá sesión acá
            </Button>
          </Link>
        </div>
      </div>
    </SignInUpLayout>
  );
}
