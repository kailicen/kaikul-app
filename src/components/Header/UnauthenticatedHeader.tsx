import { Bars3Icon } from "@heroicons/react/24/solid";
import Authentication from "@/components/Header/HeaderRight/Authentication";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

type ColorMode = "light" | "dark";

export type HeaderProps = {
  user?: User | null;
  scrollToTop: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToTestimonial: () => void;
  scrollToQna: () => void;
  scrollToTeam: () => void;
  textColor: Record<ColorMode, string>;
  colorMode: ColorMode;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  headerBgColor: string;
};

const UnauthenticatedHeader: React.FC<HeaderProps> = ({
  user,
  scrollToTop,
  scrollToHowItWorks,
  scrollToFeatures,
  scrollToTestimonial,
  scrollToQna,
  scrollToTeam,
  textColor,
  colorMode,
  isMenuOpen,
  toggleMenu,
  headerBgColor,
}) => {
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 left-0 right-0 p-5 flex justify-between px-5 md:px-20 ${headerBgColor} mx-auto z-20 items-center`}
    >
      <div
        className={`font-bold text-xl md:text-2xl 3xl:text-3xl text-${textColor[colorMode]} hover:cursor-pointer hover:text-violet-600`}
        onClick={scrollToTop}
      >
        KaiKul
      </div>
      {user ? (
        <Authentication user={user} />
      ) : (
        <>
          {/* desktop screen */}
          <div className="hidden md:flex md:flex-row items-center space-x-2 md:space-x-5 font-semibold 3xl:text-xl">
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer`}
              onClick={() => router.push("/blog")}
            >
              Blog
            </div>
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer btn`}
              onClick={scrollToHowItWorks}
            >
              How It Works
            </div>
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer btn`}
              onClick={scrollToFeatures}
            >
              Features
            </div>
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer btn`}
              onClick={scrollToTestimonial}
            >
              Testimonial
            </div>
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer btn`}
              onClick={scrollToQna}
            >
              FAQ
            </div>
            <div
              className={`text-${textColor[colorMode]} hover:text-violet-600 hover:cursor-pointer btn`}
              onClick={scrollToTeam}
            >
              Our Team
            </div>
            <Authentication user={user} />
          </div>
          {/* mobile header right */}
          <div className="flex flex-row gap-4 md:hidden">
            <Authentication user={user} />
            <Bars3Icon
              onClick={toggleMenu}
              className="h-8 w-8 text-black cursor-pointer"
            />
          </div>
          {/* mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-20 right-0 w-full p-4 bg-white z-20 flex flex-col items-end">
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => router.push("/blog")}
              >
                Blog
              </div>
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  scrollToHowItWorks();
                }}
              >
                How It Works
              </div>
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  scrollToFeatures();
                }}
              >
                Features
              </div>
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  scrollToTestimonial();
                }}
              >
                Testimonial
              </div>
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  scrollToQna();
                }}
              >
                FAQ
              </div>
              <div
                className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  scrollToTeam();
                }}
              >
                Our Team
              </div>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default UnauthenticatedHeader;
