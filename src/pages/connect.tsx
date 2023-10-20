import React from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import LoadingScreen from "@/components/LoadingScreen";
import ConnectPage from "@/components/App/ReflectAndConnect";

function Connect() {
  const [user] = useAuthState(auth);

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] mx-auto md:container">
          <ConnectPage user={user} />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default Connect;
