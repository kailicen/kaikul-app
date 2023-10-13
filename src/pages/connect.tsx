import React from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import LoadingScreen from "@/components/LoadingScreen";
import ConnectPage from "@/components/App/ReflectAndConnect";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";

function Connect() {
  const [user] = useAuthState(auth);

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] mx-auto">
          <ConnectPage user={user} />
          <FloatingFeedbackButton /> {/* Add the feedback button */}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default Connect;
