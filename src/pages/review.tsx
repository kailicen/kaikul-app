import React from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import ReflectAndConnectPage from "@/components/App/ReflectAndConnect/ReflectAndConnectPage";
import LoadingScreen from "@/components/LoadingScreen";

function Review() {
  const [user] = useAuthState(auth);

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] container mx-auto">
          <ReflectAndConnectPage user={user} />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default Review;
