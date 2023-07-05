import { WeeklyGoal } from "@/atoms/weeklyGoalsAtom";
import moment from "moment";

export const mockGoals: WeeklyGoal[] = [
  {
    id: "1",
    text: "Complete project milestone",
    completed: true,
    weekStart: moment("2023-06-24").startOf("week").format("YYYY-MM-DD"),
    userId: "pSbkZAhivpYQA7iy4iD0cgl8E6C2",
  },
  {
    id: "2",
    text: "Learn a new programming language",
    completed: false,
    weekStart: moment("2023-07-01").startOf("week").format("YYYY-MM-DD"),
    userId: "pSbkZAhivpYQA7iy4iD0cgl8E6C2",
  },
  {
    id: "3",
    text: "Read a book on personal development",
    completed: false,
    weekStart: moment("2023-07-08").startOf("week").format("YYYY-MM-DD"),
    userId: "pSbkZAhivpYQA7iy4iD0cgl8E6C2",
  },
  // more mock goals here...
];
