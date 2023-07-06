import { useState, useEffect } from "react";
import { Blocker } from "../atoms/blockersAtom";
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

export const useBlockers = (date: string, user: User) => {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [newBlocker, setNewBlocker] = useState<string>("");

  const handleAddBlocker = async () => {
    if (blockers.length < 3) {
      const blockerToAdd: Blocker = {
        id: "", // Placeholder value, will be updated after adding the document
        text: newBlocker,
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
        setNewBlocker("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleEditBlocker = async (id: string, newValue: string) => {
    const updatedBlockers = blockers.map((blocker) =>
      blocker.id === id ? { ...blocker, text: newValue } : blocker
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
      const blockersForDay: Blocker[] = [];
      querySnapshot.forEach((doc) => {
        const blocker = doc.data() as Blocker;
        blocker.id = doc.id;
        blockersForDay.push(blocker);
      });
      setBlockers(blockersForDay);
    };
    loadBlockers();
  }, [user, date, setBlockers]);

  return {
    blockers,
    newBlocker,
    setNewBlocker,
    handleAddBlocker,
    handleEditBlocker,
    handleDeleteBlocker,
  };
};
