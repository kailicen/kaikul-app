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
import { useToast } from "@chakra-ui/react";
import useUserPoints from "./useUserPoints";

export type WeeklyReflection = {
  id: string;
  startOfWeek: string;
  rateWeek: number;
  rateHappiness: number;
  practiceHours: number;
  biggestImprovement: string;
  biggestObstacle: string;
  lessonLearned: string;
  userId: string;
  discussion?: string;
};

export const useTeamTab = (user: User, startOfWeek: string) => {
  const [teamTabs, setTeamTabs] = useState<WeeklyReflection[]>([]);
  const [isCurrentWeekDataExist, setIsCurrentWeekDataExist] =
    useState<boolean>(false);
  const { userPoints, setUserPoints, syncPointsToFirebase } =
    useUserPoints(user);
  const toast = useToast();

  const updatePoints = async (pointsToAdd: number) => {
    const newPoints = userPoints + pointsToAdd;
    setUserPoints(newPoints);
    toast({
      title: "Points Earned!",
      description: `You earned ${pointsToAdd} points.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Sync the new points to Firebase
    await syncPointsToFirebase(user.uid, newPoints);
  };

  const handleAddTeamTab = async (
    startOfWeek: string,
    rateWeek: number,
    rateHappiness: number,
    practiceHours: number,
    biggestImprovement: string,
    biggestObstacle: string,
    lessonLearned: string
  ) => {
    const teamTabToAdd: WeeklyReflection = {
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
      setTeamTabs([teamTabToAdd, ...teamTabs]); // Change this line

      // Compute the points
      const pointsToAdd = 20 + rateWeek + rateHappiness + practiceHours;

      // Update the points
      await updatePoints(pointsToAdd);
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
    // add points
    const originalTab = teamTabs.find((tab) => tab.id === id);
    if (originalTab) {
      const diff =
        rateWeek +
        rateHappiness +
        practiceHours -
        (originalTab.rateWeek +
          originalTab.rateHappiness +
          originalTab.practiceHours);
      updatePoints(diff);
    }

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
      if (user && user.uid) {
        // add this line
        const q = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", user.uid),
          orderBy("startOfWeek", "desc")
        );
        const querySnapshot = await getDocs(q);
        const teamTabs: WeeklyReflection[] = [];
        querySnapshot.forEach((doc) => {
          const teamTab = doc.data() as WeeklyReflection;
          teamTab.id = doc.id;
          teamTabs.push(teamTab);
          if (teamTab.startOfWeek === startOfWeek) {
            setIsCurrentWeekDataExist(true);
          }
        });
        setTeamTabs(teamTabs);
      } // and this line
    };
    loadTeamTabs();
  }, [user, startOfWeek]);

  return {
    teamTabs,
    handleUpdateTeamTab,
    handleAddTeamTab,
    isCurrentWeekDataExist,
  };
};
