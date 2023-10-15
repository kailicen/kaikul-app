import { Task } from "@/atoms/tasksAtom";
import { FC, ReactNode } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";

interface DraggableTaskProps {
  task: Task;
  children: ReactNode;
}

const DraggableTask: FC<DraggableTaskProps> = ({ task, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item: { task: Task } | undefined, monitor: DragSourceMonitor) => {
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
