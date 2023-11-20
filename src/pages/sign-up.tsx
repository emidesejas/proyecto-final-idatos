import type { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import backgroundImage from "@images/sign_in.webp";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { LabeledInput } from "@components/ui/input";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";

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
      title: "Registro exitoso!",
      description: "Gracias por unirte! Te estamos redirigiendo a la app.",
    });

    await router.replace("/");
  };

  return (
    <div className="flex h-screen w-full">
      <Image
        src={backgroundImage}
        alt={""}
        className="h-full w-7/12 object-cover"
      />
      <div className="flex h-full w-5/12 flex-col items-center justify-center bg-cover backdrop-blur-sm">
        <div className="flex w-80 flex-col justify-center gap-3 text-center">
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
              <Button type="submit" className="mt-5 w-36" loading={loading}>
                Registrarte
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
