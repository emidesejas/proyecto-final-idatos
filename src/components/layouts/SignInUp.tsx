import Image from "next/image";
import backgroundImage from "@images/sign_in.webp";

const SignInUpLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full">
    <Image
      src={backgroundImage}
      alt={""}
      className="hidden h-full w-7/12 object-cover md:flex"
    />
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:w-5/12 md:p-0">
      {children}
    </div>
  </div>
);

export default SignInUpLayout;
