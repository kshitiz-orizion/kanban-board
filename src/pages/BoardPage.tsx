import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';

import { mockFetchIssues, mockUpdateIssue } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Issue {
  id: string;
  title: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high';
  severity: number;
  createdAt: string;
  assignee: string;
  tags: string[];
}

const statusList: Issue['status'][] = ['Backlog', 'In Progress', 'Done'];

// 🟩 Draggable Card
const DraggableCard = ({
  issue,
  isDraggingGlobal,
}: {
  issue: Issue;
  isDraggingGlobal: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
  });

  const navigate = useNavigate();
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: 'grab',
    borderTop: `2px solid ${
      issue.status === 'Done'
        ? 'green'
        : issue.status === 'Backlog'
        ? 'red'
        : 'orange'
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

// 🟦 Droppable Column
const DroppableColumn = ({
  status,
  issues,
  isDraggingGlobal,
}: {
  status: Issue['status'];
  issues: Issue[];
  isDraggingGlobal: boolean;
}) => {
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
          />
        ))
      ) : (
        <p style={{ color: '#aaa', fontStyle: 'italic' }}>
          No matching issues
        </p>
      )}
    </div>
  );
};

export const BoardPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previousIssues, setPreviousIssues] = useState<Issue[] | null>(null);
  const previousIssuesRef = useRef<Issue[] | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data: Issue[]|any = await mockFetchIssues();
      setIssues(data);
    } catch (error) {
      toast("Failed to load issues");
    }
  };

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 0.01 },
  });
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as Issue['status'];

    if (newStatus) {
      setPreviousIssues(issues);
      previousIssuesRef.current = issues;

      setIssues(prev =>
        prev.map(issue =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );

      setShowUndo(true);
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(async () => {
        try {
          await mockUpdateIssue(issueId, { status: newStatus });
          setShowUndo(false);
          setPreviousIssues(null);
          previousIssuesRef.current = null;
        } catch (e) {
          handleUndo();
          toast("Something went wrong");
        }
      }, 5000);
    }
  };

  const handleUndo = () => {
    if (previousIssuesRef.current) {
      setIssues(previousIssuesRef.current);
      setPreviousIssues(null);
      previousIssuesRef.current = null;
      setShowUndo(false);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    }
  };

  const getFilteredIssues = (status: Issue['status']) => {
    return issues.filter(issue => {
      const matchesStatus = issue.status === status;
      const matchesSearch =
        searchTerm.trim() === '' ||
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesPriority =
        !priorityFilter || issue.priority === priorityFilter;

      return matchesStatus && matchesSearch && matchesPriority;
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* 🔍 Search & Filter Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title, assignee, or tag"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="searchBox"
        />
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="priorityFilter"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* 🛑 Undo Notification */}
      {showUndo && (
        <div
          className="undo-banner"
          style={{
            marginBottom: '1rem',
            background: '#fff3cd',
            padding: '10px',
            border: '1px solid #ffeeba',
          }}
        >
          <span>Issue moved. </span>
          <button onClick={handleUndo} style={{ marginLeft: '1rem' }}>
            Undo
          </button>
        </div>
      )}

      {/* 🧩 Kanban Board with DnD */}
      <div className="kanbanBoard">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setIsDragging(false)}
        >
          {statusList.map(status => (
            <DroppableColumn
              key={status}
              status={status}
              issues={getFilteredIssues(status)}
              isDraggingGlobal={isDragging}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};
