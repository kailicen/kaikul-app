import {
  collection,
  where,
  getDocs,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase/clientApp";
import { WeeklyReflection } from "@/atoms/weeklyReflectionAtom";

export const useSingleWeeklyReflection = (
  userId: string,
  startOfWeek: string
) => {
  const [teamTab, setTeamTab] = useState<WeeklyReflection[]>([]);

  const handleAddDiscussion = async (id: string, discussion: string) => {
    try {
      await updateDoc(doc(firestore, "teamTabs", id), {
        discussion: discussion,
      });
      const updatedTeamTab = teamTab.map((teamTab) =>
        teamTab.id === id ? { ...teamTab, discussion } : teamTab
      );
      setTeamTab(updatedTeamTab);
    } catch (error) {
      console.error("Error adding discussion: ", error);
    }
  };

  useEffect(() => {
    const loadTeamTab = async () => {
      try {
        const q = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", userId),
          where("startOfWeek", "==", startOfWeek) // get data for the current week only
        );
        const querySnapshot = await getDocs(q);
        const teamTabs: WeeklyReflection[] = [];
        querySnapshot.forEach((doc) => {
          const teamTab = doc.data() as WeeklyReflection;
          teamTab.id = doc.id;
          teamTabs.push(teamTab);
        });
        setTeamTab(teamTabs);
      } catch (error) {
        console.error(`Failed to fetch teamTab for userId: ${userId}`, error);
      }
    };
    loadTeamTab();
  }, [userId, startOfWeek]);

  return { teamTab, handleAddDiscussion };
};
