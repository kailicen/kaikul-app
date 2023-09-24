import { useState, useCallback, useEffect } from "react";
import {
  getDoc,
  doc,
  setDoc,
  query,
  collection,
  where,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { Reaction, WeeklyAnswer } from "@/atoms/weeklyAnswersAtom";

export const useWeeklyAnswers = (
  user: User | null | undefined,
  theme: string
) => {
  const [answers, setAnswers] = useState<WeeklyAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          displayName: data?.displayName || null,
          email: data?.email || null,
        };
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    return { displayName: null, email: null };
  };

  const fetchAnswersFromFirebase = useCallback(() => {
    setLoading(true);
    const q = query(
      collection(firestore, "weeklyAnswers"),
      where("theme", "==", theme)
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const answersData: WeeklyAnswer[] = [];

        // Creating a new async function to handle async operations
        const fetchData = async () => {
          for (const docSnapshot of querySnapshot.docs) {
            const answerData = {
              id: docSnapshot.id,
              ...docSnapshot.data(),
            } as WeeklyAnswer;

            // ... your existing async code here
            if (answerData.reactions) {
              const reactionsWithUserDetails = await Promise.all(
                answerData.reactions.map(async (reaction) => {
                  const userDetails = await getUserDetails(reaction.userId);
                  return { ...reaction, userDetails };
                })
              );

              answerData.reactions = reactionsWithUserDetails;
            }

            try {
              const userDoc = await getDoc(
                doc(firestore, "users", answerData.userId)
              );
              if (userDoc.exists()) {
                answerData.displayName = userDoc.data().displayName;
                answerData.photoURL = userDoc.data().photoURL;
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
            }

            answersData.push(answerData);
          }

          setAnswers(answersData);
          setLoading(false);
        };

        // Calling the async function
        fetchData();
      },
      (error) => {
        console.error("Error fetching weekly answers:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
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

  const addReactionToFirebase = async (
    answerId: string,
    userId: string,
    emoji: string
  ) => {
    try {
      // Get a reference to the answer document
      const answerDocRef = doc(firestore, "weeklyAnswers", answerId);

      // Use a transaction to safely update the reactions array
      await runTransaction(firestore, async (transaction) => {
        const answerDoc = await transaction.get(answerDocRef);
        if (!answerDoc.exists()) {
          throw Error("Document does not exist");
        }

        // Get the current reactions array
        let reactions = answerDoc.data().reactions || [];

        // Find if the user has already reacted with this emoji
        const existingReactionIndex = reactions.findIndex(
          (reaction: Reaction) =>
            reaction.userId === userId && reaction.emoji === emoji
        );

        if (existingReactionIndex > -1) {
          // User has reacted with this emoji; remove the reaction
          reactions.splice(existingReactionIndex, 1);
        } else {
          // User hasn't reacted with this emoji; add the reaction
          reactions.push({ userId, emoji });
        }

        // Ensure reactions is an empty array if there are no reactions, rather than a falsy value
        if (reactions.length === 0) {
          reactions = [];
        }

        // Update the reactions array in the database
        transaction.update(answerDocRef, { reactions });

        // Optimistically update the local state
        setAnswers((prevAnswers) => {
          return prevAnswers.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                reactions: reactions.map((reaction: Reaction) => {
                  // Add the user details to the reaction here if necessary
                  return reaction;
                }),
              };
            }
            return answer;
          });
        });
      });
    } catch (error) {
      console.error("Failed to add reaction", error);
    }
  };

  useEffect(() => {
    if (theme) {
      setAnswers([]); // Reset the answers state when the theme changes
      fetchAnswersFromFirebase();
    }
  }, [theme, fetchAnswersFromFirebase]);

  return {
    answers,
    loading,
    addAnswerToFirebase,
    addReactionToFirebase,
  };
};
