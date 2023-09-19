import { useBuddyUserProfiles } from "@/hooks/useBuddyUserProfiles";
import React from "react";
import BuddyProfileCard from "./BuddyProfileCard";

function BuddyProfilesContainer() {
  const { userProfiles, loading } = useBuddyUserProfiles();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userProfiles.map((userProfile, index) => (
        <BuddyProfileCard key={index} userProfile={userProfile} />
      ))}
    </div>
  );
}

export default BuddyProfilesContainer;
