import { Goal } from "@/atoms/goalsAtom";
import { Task } from "@/atoms/tasksAtom";
import { userMilestoneState, userPointsState } from "@/atoms/userPointsAtom";
import { firestore } from "@/firebase/clientApp";
import { Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { FiAward } from "react-icons/fi";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from "date-fns";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const milestones = [
  {
    points: 100,
    badge: "Bronze",
    notification: "Congratulations! You've reached the bronze level.",
  },
  {
    points: 200,
    badge: "Silver",
    notification: "Amazing! You've unlocked the silver badge.",
  },
  {
    points: 500,
    badge: "Gold",
    notification: "Fantastic! You've achieved the gold status.",
  },
  // Add more milestones as needed
];

const useUserPoints = (user: User) => {
  const [userPoints, setUserPoints] = useRecoilState(userPointsState);
  const [achievedMilestones, setAchievedMilestones] =
    useRecoilState(userMilestoneState);
  const toast = useToast();

  const computePointsForTask = (
    originalTask: Task,
    updatedTask: Task,
    currentPoints: number
  ): number => {
    let newPoints = currentPoints;

    // If the original task was NOT completed, but the updated task IS completed
    if (!originalTask.completed && updatedTask.completed) {
      newPoints += 5;
      if (updatedTask.goalId) {
        newPoints += 2;
      }
    }
    // If the original task WAS completed, but the updated task is NOT completed
    else if (originalTask.completed && !updatedTask.completed) {
      newPoints -= 5;
      if (originalTask.goalId) {
        newPoints -= 2;
      }
    }

    return newPoints;
  };

  // Function to compute points based on the goal's duration
  function computeGoalPoints(startDate: string, endDate: string): number {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const durationInDays = differenceInDays(end, start);
    const durationInMonths = differenceInMonths(end, start);
    const durationInYears = differenceInYears(end, start);

    if (durationInDays <= 30) {
      return 10;
    } else if (durationInMonths <= 3) {
      return 30;
    } else if (durationInYears < 1) {
      return 50;
    } else {
      return 100; // Over a year
    }
  }

  // Function to compute points for completing/uncompleting a goal
  const computePointsForGoal = (
    originalGoal: Goal,
    updatedGoal: Goal,
    currentPoints: number
  ): number => {
    let newPoints = currentPoints;

    // Get the point value for the goal duration
    const pointsForCompletion = computeGoalPoints(
      updatedGoal.startDate,
      updatedGoal.endDate
    );

    // If the original goal was NOT completed, but the updated goal IS completed
    if (!originalGoal.completed && updatedGoal.completed) {
      newPoints += pointsForCompletion;
    }
    // If the original goal WAS completed, but the updated goal is NOT completed
    else if (originalGoal.completed && !updatedGoal.completed) {
      newPoints -= pointsForCompletion;
    }

    return newPoints;
  };

  const updatePoints = async (pointsToAdd: number) => {
    const newPoints = userPoints + pointsToAdd;
    setUserPoints(newPoints);

    // Step 3: Check Milestones
    for (const milestone of milestones) {
      if (
        newPoints >= milestone.points &&
        !achievedMilestones.includes(milestone.badge)
      ) {
        // Award badge to the user and show notification
        toast({
          title: "Milestone Reached!",
          description: milestone.notification,
          status: "success",
          duration: 7000,
          isClosable: true,
          position: "top-right",
          render: () => (
            <Flex
              direction="column"
              justify="center"
              align="center"
              p={3}
              m={4}
              w="sm"
              borderRadius="md"
              bg="#ff5e0e"
              color="white"
              shadow="md"
            >
              <Icon as={FiAward} w={10} h={10} mb={2} />
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Milestone Reached!
              </Text>
              <Text textAlign="center">{milestone.notification}</Text>
            </Flex>
          ),
        });

        setAchievedMilestones((prevMilestones) => [
          ...prevMilestones,
          milestone.badge,
        ]);

        // Step 4: Store Achieved Milestone in Firebase
        await syncMilestoneToFirebase(user.uid, milestone);
      }
    }

    // Determine the type of toast to show based on whether points are being added or deducted
    if (pointsToAdd > 0) {
      toast({
        title: "Points Earned!",
        description: `You earned ${pointsToAdd} points.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (pointsToAdd < 0) {
      toast({
        title: "Points Deducted",
        description: `You lost ${Math.abs(pointsToAdd)} points.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Handle the case where no points were added or deducted, if necessary
      toast({
        title: "No Change in Points",
        description: "No points were added or deducted.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    // Sync the new points to Firebase
    await syncPointsToFirebase(user.uid, newPoints);
  };

  const syncPointsToFirebase = async (userId: string, points: number) => {
    const userPointsDocRef = doc(firestore, "userPoints", userId);
    try {
      await setDoc(userPointsDocRef, { userId, points }, { merge: true });
    } catch (error) {
      console.error("Error syncing points to Firebase:", error);
    }
  };

  const syncMilestoneToFirebase = async (userId: string, milestone: any) => {
    try {
      const userPointsDocRef = doc(firestore, "userPoints", userId);
      const docSnapshot = await getDoc(userPointsDocRef);

      let milestones = [];
      if (docSnapshot.exists()) {
        milestones = docSnapshot.data()?.milestones || [];
      }

      milestones.push(milestone.badge);

      await setDoc(userPointsDocRef, { milestones }, { merge: true });
    } catch (error) {
      console.error("Error syncing milestone to Firebase:", error);
    }
  };

  useEffect(() => {
    const fetchUserPointsFromFirebase = async () => {
      const userPointsDocRef = doc(firestore, "userPoints", user.uid);
      try {
        const docSnapshot = await getDoc(userPointsDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserPoints(data?.points || 0); // Set the user's points if found, else default to 0
          setAchievedMilestones(data?.milestones || []); // Set the user's milestones if found, else default to empty array
        }
      } catch (error) {
        console.error("Error fetching user data from Firebase:", error);
      }
    };

    fetchUserPointsFromFirebase();
  }, [user]);

  return {
    userPoints,
    computePointsForTask,
    computePointsForGoal,
    computeGoalPoints,
    updatePoints,
  };
};

export default useUserPoints;
