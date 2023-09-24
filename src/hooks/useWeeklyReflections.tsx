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
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useEffect, useState } from "react";
import useUserPoints from "./useUserPoints";
import { WeeklyReflection } from "@/atoms/weeklyReflectionAtom";

export const useWeeklyReflections = (user: User, startOfWeek: string) => {
  const [teamTabs, setTeamTabs] = useState<WeeklyReflection[]>([]);
  const [isCurrentWeekDataExist, setIsCurrentWeekDataExist] =
    useState<boolean>(false);
  const { updatePoints } = useUserPoints(user);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dataForSelectedDate, setDataForSelectedDate] =
    useState<WeeklyReflection | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // or any other number you want
  const [lastVisibleDocument, setLastVisibleDocument] =
    useState<QueryDocumentSnapshot | null>(null);

  const [pageSnapshots, setPageSnapshots] = useState<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([]);

  const handleNextPage = () => {
    setPageSnapshots([...pageSnapshots, lastVisibleDocument]);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageSnapshots((prev) => {
        const newSnapshots = [...prev];
        newSnapshots.pop();
        return newSnapshots;
      });
      setCurrentPage((prev) => prev - 1);
    }
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

      const pointsToAdd = Math.round(
        (7 + rateWeek + rateHappiness + practiceHours) / 5
      );

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
      const newTotal = rateWeek + rateHappiness + practiceHours;
      const originalTotal =
        originalTab.rateWeek +
        originalTab.rateHappiness +
        originalTab.practiceHours;

      const diff = Math.round((newTotal - originalTotal) / 5);
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

      // Update dataForSelectedDate state if the id matches
      if (dataForSelectedDate && dataForSelectedDate.id === id) {
        setDataForSelectedDate(
          updatedTeamTabs.find((teamtab) => teamtab.id === id) || null
        );
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const fetchUniqueDates = async () => {
    if (user && user.uid) {
      try {
        const q = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", user.uid),
          orderBy("startOfWeek", "desc")
        );

        const querySnapshot = await getDocs(q);

        const dates: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as WeeklyReflection;
          if (!dates.includes(data.startOfWeek)) {
            dates.push(data.startOfWeek);
          }
        });

        setUniqueDates(dates);
      } catch (error) {
        console.error("Error fetching unique dates: ", error);
      }
    }
  };

  useEffect(() => {
    fetchUniqueDates();
  }, [user]);

  const fetchDataForSelectedDate = async (date: string) => {
    if (user && user.uid) {
      try {
        const q = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", user.uid),
          where("startOfWeek", "==", date)
        );

        const querySnapshot = await getDocs(q);

        let data: WeeklyReflection | null = null;
        querySnapshot.forEach((doc) => {
          data = { ...doc.data(), id: doc.id } as WeeklyReflection;
        });

        setDataForSelectedDate(data);
      } catch (error) {
        console.error("Error fetching data for selected date: ", error);
      }
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchDataForSelectedDate(selectedDate);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    const loadTeamTabs = async () => {
      if (user && user.uid) {
        // Add limit and startAfter to implement pagination
        let q = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", user.uid),
          orderBy("startOfWeek", "desc"),
          limit(itemsPerPage)
        );

        if (currentPage === 1) {
          setLastVisibleDocument(null);
        }

        if (currentPage > 1) {
          const startAtDoc = pageSnapshots[pageSnapshots.length - 1];
          q = query(
            collection(firestore, "teamTabs"),
            where("userId", "==", user.uid),
            orderBy("startOfWeek", "desc"),
            limit(itemsPerPage),
            startAfter(startAtDoc)
          );
        }

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
        // Set the last visible document for pagination
        if (!querySnapshot.empty) {
          setLastVisibleDocument(
            querySnapshot.docs[querySnapshot.docs.length - 1]
          );
        }
      }
    };
    loadTeamTabs();
  }, [user, startOfWeek, currentPage]); // Added dependency on `currentPage`

  return {
    teamTabs,
    handleUpdateTeamTab,
    handleAddTeamTab,
    isCurrentWeekDataExist,
    handleNextPage,
    handlePrevPage,
    currentPage,
    selectedDate,
    setSelectedDate,
    dataForSelectedDate,
    setDataForSelectedDate,
    uniqueDates,
  };
};
