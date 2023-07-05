import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import { User } from "firebase/auth";
import UserMenu from "./UserMenu";
import { Flex } from "@chakra-ui/react";
import UserProgressMenu from "./UserProgressMenu";

type Props = { user?: User | null };

function Authentication({ user }: Props) {
  return (
    <>
      <AuthModal />
      <div className="flex flex-row">
        {user ? (
          <Flex gap={2}>
            <UserProgressMenu user={user} />
            <UserMenu user={user} />
          </Flex>
        ) : (
          <AuthButtons />
        )}
      </div>
    </>
  );
}

export default Authentication;
