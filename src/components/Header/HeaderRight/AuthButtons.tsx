import React from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Box, Button } from "@chakra-ui/react";

type Props = {};

function AuthButtons({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <div>
      <Box className="hidden md:flex flex-row gap-3">
        <Button
          onClick={() => setAuthModalState({ open: true, view: "login" })}
          variant="outline"
        >
          Log In
        </Button>
        <Button
          onClick={() => setAuthModalState({ open: true, view: "signup" })}
        >
          Sign Up
        </Button>
      </Box>
      <div className="md:hidden">
        <Button
          onClick={() => setAuthModalState({ open: true, view: "login" })}
          variant="outline"
        >
          Log In
        </Button>
      </div>
    </div>
  );
}

export default AuthButtons;
