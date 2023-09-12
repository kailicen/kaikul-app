import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        className="hover:text-muted-foreground"
        onClick={() => signInWithGoogle()}
      >
        <Image src="/img/googlelogo.png" height="20px" mr={4} />
        Continue with Google
      </Button>
      {error && <Text className="text-destructive text-center">{error.message}</Text>}
    </Flex>
  );
};

export default OAuthButtons;
