import React, { useEffect, useState } from 'react';
import { Issue, IssueStatus } from '../types';
import { useIssueContext } from './IssueContext';

const statusColors: Record<IssueStatus, string> = {
  'Backlog': '#f8d7da',       // light red
  'In Progress': '#fff3cd', // light yellow
  'Done': '#d4edda',          // light green
};

export const Sidebar: React.FC = () => {
  const { lastUpdated } = useIssueContext()
  const [issues, setIssues] = useState<Issue[]>([]);


  useEffect(() => {
    const loadIssues = () => {
      const stored = localStorage.getItem('viewedIssues');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Issue[];
          setIssues(parsed);
        } catch (e) {
          console.error('Invalid localStorage data:', e);
        }
      }
    };

    loadIssues(); // Initial load

    // 🔔 Listen for updates
    const handleUpdate = () => loadIssues();
    window.addEventListener('viewedIssuesUpdated', handleUpdate);

    return () => {
      window.removeEventListener('viewedIssuesUpdated', handleUpdate);
    };
  }, []);


  return (
    <div className='sideBarContainer' >
      <h3>Recenly viewed issues</h3>
      {issues.length === 0 ? (
        <p className='emptyIssues'>No issues viewed yet</p>
      ) : (
        <ul className="issueList">
          {issues.map(issue => (
            <li
              key={issue.id}
              className='issueItem'
              style={{
                backgroundColor: statusColors[issue.status],
              }}
            >
              {issue.title}
            </li>
          ))}
        </ul>
      )}
      <div  className="dateTime" >{lastUpdated ? new Date(Number(lastUpdated)).toLocaleString() : new Date(Date.now()).toLocaleString()}</div>
    </div>
  );
};
