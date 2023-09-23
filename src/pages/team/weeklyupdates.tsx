import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/LoadingScreen";
import WeeklyUpdatesShare from "@/components/App/TeamPage/WeeklyUpdatesShare/WeeklyUpdatesShare";

type Props = {};

function WeeklyUpdatePage({}: Props) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { buddyId: buddyIdQuery } = router.query;
  const buddyId = Array.isArray(buddyIdQuery) ? buddyIdQuery[0] : buddyIdQuery;

  // If Firebase auth or buddyId is not ready, show a loading indicator or return null
  if (loading || !buddyId || !user) {
    return <LoadingScreen />; // replace with your loading indicator if needed
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      <WeeklyUpdatesShare user={user} buddyId={buddyId} />
    </>
  );
}

export default WeeklyUpdatePage;
