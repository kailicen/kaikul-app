import React from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Icon } from "@chakra-ui/react";
import { IoMdLogIn } from "react-icons/io";

type Props = {};

function AuthButtons({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <div>
      <div className="hidden md:flex flex-row gap-2">
        <button
          onClick={() => setAuthModalState({ open: true, view: "login" })}
          className="btn buttonMobileSecondary md:buttonSecondary"
        >
          Log In
        </button>
        <button
          onClick={() => setAuthModalState({ open: true, view: "signup" })}
          className="btn buttonMobile md:button"
        >
          Sign Up
        </button>
      </div>
      <div className="md:hidden">
        <Icon
          as={IoMdLogIn}
          fontSize={30}
          onClick={() => setAuthModalState({ open: true, view: "login" })}
        />
      </div>
    </div>
  );
}

export default AuthButtons;
