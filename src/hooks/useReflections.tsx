import { useState, useEffect } from "react";
import { Reflection } from "../atoms/reflectionsAtom";
import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import useUserPoints from "./useUserPoints";

export const useBlockers = (date: string, user: User) => {
  const [blockers, setBlockers] = useState<Reflection[]>([]);
  const { updatePoints } = useUserPoints(user);

  const handleAddBlocker = async (blocker: string) => {
    // Update points
    const pointsToAdd = 2;
    await updatePoints(pointsToAdd);
    const blockerToAdd: Reflection = {
      id: "", // Placeholder value, will be updated after adding the document
      text: blocker,
      date: date,
      userId: user.uid,
    };
    try {
      const docRef = await addDoc(
        collection(firestore, "blockers"),
        blockerToAdd
      );
      blockerToAdd.id = docRef.id; // Update the id value
      setBlockers([...blockers, blockerToAdd]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEditBlocker = async (id: string, newBlocker: string) => {
    const updatedBlockers = blockers.map((blocker) =>
      blocker.id === id ? { ...blocker, text: newBlocker } : blocker
    );

    try {
      await updateDoc(doc(firestore, "blockers", id), {
        text: updatedBlockers.find((blocker) => blocker.id === id)?.text,
      });
      setBlockers(updatedBlockers);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteBlocker = async (id: string) => {
    setBlockers(blockers.filter((blocker) => blocker.id !== id));

    // Update points
    const pointsToAdd = -2;
    await updatePoints(pointsToAdd);

    try {
      await deleteDoc(doc(firestore, "blockers", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const loadBlockers = async () => {
      const q = query(
        collection(firestore, "blockers"),
        where("date", "==", date),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const blockersForDay: Reflection[] = [];
      querySnapshot.forEach((doc) => {
        const blocker = doc.data() as Reflection;
        blocker.id = doc.id;
        blockersForDay.push(blocker);
      });
      setBlockers(blockersForDay);
    };
    loadBlockers();
  }, [user, date]);

  return {
    blockers,
    handleAddBlocker,
    handleEditBlocker,
    handleDeleteBlocker,
  };
};
