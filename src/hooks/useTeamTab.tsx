import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  query,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useEffect, useState } from "react";
import { WeeklyGoal } from "@/atoms/weeklyGoalsAtom";

type TeamTab = {
  id: string;
  startOfWeek: string;
  rateWeek: number;
  rateHappiness: number;
  practiceHours: number;
  biggestImprovement: string;
  biggestObstacle: string;
  lessonLearned: string;
  userId: string;
};

export const useTeamTab = (user: User, startOfWeek: string) => {
  const [teamTabs, setTeamTabs] = useState<TeamTab[]>([]);

  const handleAddTeamTab = async (
    startOfWeek: string,
    rateWeek: number,
    rateHappiness: number,
    practiceHours: number,
    biggestImprovement: string,
    biggestObstacle: string,
    lessonLearned: string
  ) => {
    const teamTabToAdd: TeamTab = {
      id: "",
      startOfWeek,
      rateWeek,
      rateHappiness,
      practiceHours,
      biggestImprovement,
      biggestObstacle,
      lessonLearned,
      userId: user.uid,
    };
    try {
      const docRef = await addDoc(
        collection(firestore, "teamTabs"),
        teamTabToAdd
      );
      teamTabToAdd.id = docRef.id; // Update the id value
      setTeamTabs([...teamTabs, teamTabToAdd]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdateTeamTab = async (
    id: string,
    rateWeek: number,
    rateHappiness: number,
    practiceHours: number,
    biggestImprovement: string,
    biggestObstacle: string,
    lessonLearned: string
  ) => {
    const updatedTeamTabs = teamTabs.map((teamtab) =>
      teamtab.id === id
        ? {
            ...teamtab,
            rateWeek,
            rateHappiness,
            practiceHours,
            biggestImprovement,
            biggestObstacle,
            lessonLearned,
          }
        : teamtab
    );

    try {
      await updateDoc(doc(firestore, "teamTabs", id), {
        rateWeek: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.rateWeek,
        rateHappiness: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.rateHappiness,
        practiceHours: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.practiceHours,
        biggestImprovement: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.biggestImprovement,
        biggestObstacle: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.biggestObstacle,
        lessonLearned: updatedTeamTabs.find((teamtab) => teamtab.id === id)
          ?.lessonLearned,
      });
      setTeamTabs(updatedTeamTabs);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const loadTeamTabs = async () => {
      const q = query(
        collection(firestore, "teamTabs"),
        where("startOfWeek", "==", startOfWeek),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const teamTabsForWeek: TeamTab[] = [];
      querySnapshot.forEach((doc) => {
        const teamTab = doc.data() as TeamTab;
        teamTab.id = doc.id;
        teamTabsForWeek.push(teamTab);
      });
      setTeamTabs(teamTabsForWeek);
    };
    loadTeamTabs();
  }, [user, startOfWeek, setTeamTabs]);

  return {
    teamTabs,
    handleUpdateTeamTab,
    handleAddTeamTab,
  };
};
