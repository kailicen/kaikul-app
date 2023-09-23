import { auth } from "../firebase/clientApp";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/LoadingScreen";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import TrackerPage from "@/components/App/Tracker/TrackerPage";

type Props = {};

function Tracker({}: Props) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] px-2 md:px-10 3xl:px-32">
          <TrackerPage user={user} />
        </div>
      ) : null}
    </>
  );
}

export default Tracker;
