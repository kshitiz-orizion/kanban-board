import React, { useEffect, useState } from 'react';

interface Issue {
  id: string;
  title: string;
  status: 'Backlog' | 'In Progress' | 'Done';
}

const statusColors: Record<Issue['status'], string> = {
  'Backlog': '#f8d7da',       // light red
  'In Progress': '#fff3cd', // light yellow
  'Done': '#d4edda',          // light green
};

export const Sidebar: React.FC = () => {
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
    <div style={{
      width: '250px',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderRight: '1px solid #ccc',
      overflowY: 'auto'
    }}>
      <h3>Recenly viewed issues</h3>
      {issues.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666' }}>No issues viewed yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {issues.map(issue => (
            <li
              key={issue.id}
              style={{
                marginBottom: '0.5rem',
                padding: '0.5rem',
                backgroundColor: statusColors[issue.status],
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {issue.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
