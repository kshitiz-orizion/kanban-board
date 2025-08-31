import React, { useState, useRef } from 'react';
import { Issue, IssueStatus } from '../types';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';

import DroppableColumn from '../components/DropableColumn';

import { currentUser } from '../constants/currentUser';
import { mockUpdateIssue } from '../utils/api';

import { toast } from 'react-toastify';
import { useIssueContext } from '../components/IssueContext';

import { useMockInsertIssues } from '../hooks/useMockInsertIssue';
import { sortIssues } from '../utils/sorting';

const statusList: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];

// Helper to show undo toast with button, dismisses previous undo toast if any
const showUndoToast = (
  handleUndo: () => void,
  undoToastIdRef: React.RefObject<string | number | null>
) => {
  if (undoToastIdRef.current !== null) {
    toast.dismiss(undoToastIdRef.current);
  }

  undoToastIdRef.current = toast(
    ({ closeToast }) => (
      <div className='toastContainer'>
        <span>Issue moved.</span>
        <button
          onClick={() => {
            handleUndo();
            closeToast();
          }}
          className='taostButton'
        >
          Undo
        </button>
      </div>
    ),
    {
      autoClose: 5000,
      pauseOnHover: true,
      closeOnClick: false,
      draggable: false,
      position: 'top-right',
    }
  );
};

export const BoardPage = () => {
  const { issues, setIssues } = useIssueContext();
  useMockInsertIssues();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previousIssues, setPreviousIssues] = useState<Issue[] | null>(null);
  const previousIssuesRef = useRef<Issue[] | null>(null);
  const undoTimer = useRef<NodeJS.Timeout | null>(null);
  const undoToastId = React.useRef<number | string | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 0.01 },
  });
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor, pointerSensor);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;

    if (newStatus) {
      setPreviousIssues(issues);
      previousIssuesRef.current = issues;

      setIssues(prev => {
        const updated = prev.map(issue =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        );

        const sorted = sortIssues(updated);
        return sorted;
      });


      // Show undo toast, dismissing any existing one
      showUndoToast(handleUndo, undoToastId);

      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(async () => {
        try {
          await mockUpdateIssue(issueId, { status: newStatus });
          setPreviousIssues(null);
          previousIssuesRef.current = null;
          // Clear toast ID after update success
          undoToastId.current = null;
        } catch (e) {
          handleUndo();
          toast('Something went wrong');
        }
      }, 5000);
    }
  };

  const handleUndo = () => {
    if (previousIssuesRef.current) {
      setIssues(previousIssuesRef.current);
      setPreviousIssues(null);
      previousIssuesRef.current = null;
      if (undoTimer.current) clearTimeout(undoTimer.current);
      // Dismiss undo toast if still visible
      if (undoToastId.current !== null) {
        toast.dismiss(undoToastId.current);
        undoToastId.current = null;
      }
    }
  };

  const getFilteredIssues = (status: Issue['status']) => {
    return issues.filter(issue => {
      const matchesStatus = issue.status === status;
      const matchesSearch =
        searchTerm.trim() === '' ||
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;

      return matchesStatus && matchesSearch && matchesPriority;
    });
  };

  return (
    <div className="boardPageContainer">
      {/* Search & Filter Controls */}
      <div className="searchandFilter">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="searchBox"
        />
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="priorityFilter"
        >
          <option value="">All Severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Kanban Board with DnD */}
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
              isAdmin={currentUser.role === 'admin'}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};
