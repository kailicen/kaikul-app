import { useState, useCallback, useEffect } from "react";
import {
  getDoc,
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";
import { WeeklyAnswer, weeklyAnswersState } from "@/atoms/weeklyAnswersAtom";

export const useWeeklyAnswers = (
  user: User | null | undefined,
  theme: string
) => {
  const [answers, setAnswers] = useRecoilState(weeklyAnswersState);
  const [loading, setLoading] = useState(true);

  const fetchAnswersFromFirebase = useCallback(async () => {
    try {
      const q = query(
        collection(firestore, "weeklyAnswers"),
        where("theme", "==", theme)
      );
      const querySnapshot = await getDocs(q);
      const answersData: WeeklyAnswer[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const answerData = docSnapshot.data() as WeeklyAnswer;

        try {
          // Fetch user details from the "users" collection using userId
          const userDoc = await getDoc(
            doc(firestore, "users", answerData.userId)
          );
          if (userDoc.exists()) {
            // Add user details to the answerData object
            answerData.displayName = userDoc.data().displayName;
            answerData.photoURL = userDoc.data().photoURL;
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }

        answersData.push(answerData);
      }

      setAnswers(answersData);
    } catch (error) {
      console.error("Error fetching weekly answers:", error);
    }
  }, [theme, setAnswers]);

  const addAnswerToFirebase = async (
    answer: string,
    existingAnswer?: WeeklyAnswer
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const docId = existingAnswer
        ? existingAnswer.userId + theme
        : user.uid + theme;
      await setDoc(doc(firestore, "weeklyAnswers", docId), {
        theme,
        userId: user.uid,
        answer,
      });

      fetchAnswersFromFirebase();
    } catch (error) {
      console.error("Error adding/editing answer:", error);
    }
  };

  useEffect(() => {
    if (theme) {
      fetchAnswersFromFirebase();
    }
  }, [theme, fetchAnswersFromFirebase]);

  return {
    answers,
    loading,
    addAnswerToFirebase,
  };
};
