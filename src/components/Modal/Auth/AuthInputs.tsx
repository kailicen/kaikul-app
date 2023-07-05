import React from "react";
import { useRecoilValue } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import Login from "./Login";
import SignUp from "./SignUp";

type Props = {};

function AuthInputs({}: Props) {
  const modalState = useRecoilValue(authModalState);
  return (
    <div className="flex flex-col items-center w-full mt-4">
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <SignUp />}
    </div>
  );
}

export default AuthInputs;
