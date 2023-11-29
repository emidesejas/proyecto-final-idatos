import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/router";

const Header = () => {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <div className="flex w-full justify-between bg-gray-100 p-4">
      <Button
        variant="link"
        className="h-5 p-0"
        onClick={() => router.push("/")}
      >
        Inicio
      </Button>
      <Button
        variant="link"
        className="ml-auto h-5 p-0"
        onClick={async () => {
          const { error } = await supabase.auth.signOut();

          if (!error) {
            await router.replace("/sign-in");
            toast({
              title: "¡Hasta luego!",
              description: "Esperamos verte pronto",
            });
            return;
          }

          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
