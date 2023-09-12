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
      className={`${
        user ? "fixed" : "sticky"
      } top-0 w-full border-b bg-background p-3 flex justify-between px-5 md:px-20 mx-auto z-20 items-center`}
    >
      <div
        className="font-bold text-xl md:text-2xl 3xl:text-3xl hover:cursor-pointer flex flex-row gap-3 dark:text-secondary-foreground"
        onClick={() => router.push("/")}
      >
        <img
          src="/android-chrome-192x192.png"
          alt="Logo"
          width="30"
          height="30"
        />
        <span>KaiKul</span>
      </div>
      <Authentication user={user} />
    </header>
  );
};

export default AuthenticatedHeader;
