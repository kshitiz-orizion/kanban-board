import { DragableCard } from "../types";
import { useNavigate } from 'react-router-dom';

import {
  useDraggable,
} from '@dnd-kit/core';

const DraggableCard = ({
  issue,
  isDraggingGlobal,
  isAdmin
}: DragableCard) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
    disabled: !isAdmin
  });

  const navigate = useNavigate();
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: 'grab',
    borderTop: `2px solid ${issue.status === 'Done'
        ? '#008000'
        : issue.status === 'Backlog'
          ? '#FF0000'
          : '#FFA500'
      }`,
  };

  const handleClick = () => {
    if (!isDraggingGlobal) {
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="kanbanCard"
      onClick={handleClick}
    >
      <h4>{issue.title}</h4>
      <p>
        <strong>Priority:</strong> {issue.priority}
      </p>
      <p>
        <strong>Severity:</strong> {issue.severity}
      </p>
      <p>
        <strong>Assignee:</strong> {issue.assignee}
      </p>
      <div className="tags">
        {issue.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DraggableCard