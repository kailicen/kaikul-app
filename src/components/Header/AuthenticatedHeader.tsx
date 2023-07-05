import Authentication from "@/components/Header/HeaderRight/Authentication";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

export type HeaderProps = {
  user?: User | null;
};

const AuthenticatedHeader: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();

  return (
    <header
      className="fixed top-0 left-0 right-0 p-5 flex justify-between px-5 md:px-20 mx-auto z-20 items-center
    bg-white"
    >
      <div
        className="font-bold text-xl md:text-2xl 3xl:text-3xl hover:cursor-pointer hover:text-violet-600"
        onClick={() => router.push("/")}
      >
        KaiKul App
      </div>
      <Authentication user={user} />
    </header>
  );
};

export default AuthenticatedHeader;
