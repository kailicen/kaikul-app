import Authentication from "@/components/Header/HeaderRight/Authentication";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { differenceInDays, parseISO } from "date-fns";
import { firestore } from "@/firebase/clientApp";
import { useEffect } from "react";

export type HeaderProps = {
  user?: User | null;
};

const AuthenticatedHeader: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();

  // const fetchUsersWithNewTasks = async () => {
  //   const today = new Date();
  //   const oneWeekAgo = new Date(
  //     today.getTime() - 7 * 24 * 60 * 60 * 1000
  //   ).toISOString();

  //   try {
  //     const auth = getAuth();
  //     const userMap = new Map(); // Store user data with userID as the key

  //     // Listen for authentication state changes
  //     onAuthStateChanged(auth, async (user) => {
  //       if (user) {
  //         // User is signed in, get user's display name and email
  //         const { displayName, email } = user;
  //         userMap.set(user.uid, { displayName, email });
  //       } else {
  //         // User is signed out, remove from userMap (if present)
  //         userMap.delete(user!.uid);
  //       }
  //     });

  //     const q = query(
  //       collection(firestore, "tasks"),
  //       where("date", ">=", oneWeekAgo)
  //     );

  //     const querySnapshot = await getDocs(q);

  //     const usersWithNewTasks = new Set();

  //     querySnapshot.forEach((doc) => {
  //       const task = doc.data();
  //       if (task.userId) {
  //         usersWithNewTasks.add(task.userId);
  //       }
  //     });

  //     // Fetch display names and emails for users with new tasks
  //     const usersSnapshot = await getDocs(
  //       query(collection(firestore, "users"))
  //     );
  //     usersSnapshot.forEach((userDoc) => {
  //       const userData = userDoc.data();
  //       if (usersWithNewTasks.has(userDoc.id)) {
  //         const { displayName, email } = userData;
  //         userMap.set(userDoc.id, { displayName, email });
  //       }
  //     });

  //     // Log user's display name and email for users with new tasks
  //     console.log("Users with new tasks in the past one week:");
  //     Array.from(usersWithNewTasks).forEach((userId) => {
  //       if (userMap.has(userId)) {
  //         const { displayName, email } = userMap.get(userId);
  //         console.log(
  //           `User ID: ${userId}, Display Name: ${displayName}, Email: ${email}`
  //         );
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsersWithNewTasks();
  // }, [user]);
  // Call the function to execute the query and log the users with new tasks

  return (
    <header
      className="fixed top-0 left-0 right-0 p-5 flex justify-between px-5 md:px-20 mx-auto z-20 items-center
    bg-white"
    >
      <div
        className="font-bold text-xl md:text-2xl 3xl:text-3xl hover:cursor-pointer hover:text-violet-600"
        onClick={() => router.push("/")}
      >
        KaiKul App
      </div>
      <Authentication user={user} />
    </header>
  );
};

export default AuthenticatedHeader;
