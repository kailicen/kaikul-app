import { SubGoal } from "@/atoms/goalsAtom";
import { FC, ReactNode } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";

interface DraggableTaskProps {
  subGoal: SubGoal;
  children: ReactNode;
}

const DraggableTask: FC<DraggableTaskProps> = ({
  subGoal: subGoal,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { subGoal: subGoal },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (
      item: { subGoal: SubGoal } | undefined,
      monitor: DragSourceMonitor
    ) => {
      if (!monitor.didDrop()) {
        return;
      }
      // Handle the copy logic here.
      // If you are managing your task state in a parent component,
      // you might want to pass down a function as a prop to handle
      // the logic for copying a task, then call it here with the task data.
    },
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="w-full"
    >
      {children}
    </div>
  );
};

export default DraggableTask;
