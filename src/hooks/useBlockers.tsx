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
  const [isEditingBlocker, setIsEditingBlocker] = useState<null | number>(null);
  const [editBlockerText, setEditBlockerText] = useState<string>("");

  // New handler to add a blocker
  const handleAddBlocker = async () => {
    if (blockers.length < 3) {
      const blockerToAdd: Blocker = {
        text: newBlocker,
        date: date,
        userId: user.uid,
      };
      try {
        const docRef = await addDoc(
          collection(firestore, "blockers"),
          blockerToAdd
        );
        blockerToAdd.id = docRef.id;
        setBlockers([...blockers, blockerToAdd]);
        setNewBlocker("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // New handler to edit a blocker
  const handleEditBlocker = async (index: number, newValue: string) => {
    setIsEditingBlocker(null);
    const blockerToEdit = { ...blockers[index], text: newValue };
    if (blockerToEdit.id) {
      await updateDoc(
        doc(firestore, "blockers", blockerToEdit.id),
        blockerToEdit
      );
      setBlockers(
        blockers.map((blocker, i) => (i === index ? blockerToEdit : blocker))
      );
    }
  };

  // New handler to delete a blocker
  const handleDeleteBlocker = async (index: number) => {
    const blockerToDelete = blockers[index];
    if (blockerToDelete.id) {
      await deleteDoc(doc(firestore, "blockers", blockerToDelete.id));
      setBlockers(blockers.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const loadBlockers = async () => {
      const q = query(
        collection(firestore, "blockers"),
        where("date", "==", date),
        where("userId", "==", user.uid) // Filter goals by user ID
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
    isEditingBlocker,
    editBlockerText,
    setNewBlocker,
    setIsEditingBlocker,
    setEditBlockerText,
    handleAddBlocker,
    handleEditBlocker,
    handleDeleteBlocker,
  };
};
