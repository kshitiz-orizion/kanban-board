// dropableCloumn
import DraggableCard from "./DragableCard";
import { DropableColumnInterface } from "../types";
import {
  useDroppable,
} from '@dnd-kit/core';
const DroppableColumn = ({
  status,
  issues,
  isDraggingGlobal,
  isAdmin
}: DropableColumnInterface) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="kanbanColumn">
      <h2>{status}</h2>
      {issues.length > 0 ? (
        issues.map(issue => (
          <DraggableCard
            key={issue.id}
            issue={issue}
            isDraggingGlobal={isDraggingGlobal}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <p className="emptyIssues">
          No matching issues
        </p>
      )}
    </div>
  );
};

export default DroppableColumn