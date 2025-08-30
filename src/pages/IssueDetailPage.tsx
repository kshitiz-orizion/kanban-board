// IssueDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIssueContext } from '../components/IssueContext'; // ⬅️ Import context
import { currentUser } from '../constants/currentUser';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { issues, setIssues } = useIssueContext(); // ⬅️ Access context
  const issue = issues.find((issue) => issue.id === id);

  // 🔁 Save to localStorage if it doesn't exist
  useEffect(() => {
    if (!issue) return;

    const stored = localStorage.getItem('viewedIssues');
    let viewedIssues = stored ? JSON.parse(stored) : [];

    const exists = viewedIssues.some((i: any) => i.id === issue.id);

    if (!exists) {
      viewedIssues.push(issue);

      // ✅ Keep only the last 5
      if (viewedIssues.length > 5) {
        viewedIssues = viewedIssues.slice(viewedIssues.length - 5);
      }

      localStorage.setItem('viewedIssues', JSON.stringify(viewedIssues));
      window.dispatchEvent(new Event('viewedIssuesUpdated'));
    }
  }, [issue]);

  // ✅ Handler to mark issue as resolved
  const markAsResolved = () => {
    if (!issue) return;
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issue.id ? { ...i, status: 'Done' } : i
      )
    );
  };

  if (!issue) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Issue not found</h2>
        <Link to="/">Back to Board</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f4f5f7',
        minHeight: '100vh',
        position: 'relative', // ⬅️ Important for positioning the button
      }}
    >
      {/* ✅ Top-right Resolved Button */}
      <button
        onClick={markAsResolved}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: issue.status === 'Done' ? '#28a745' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: issue.status === 'Done' || currentUser.role !== "admin" ? 'not-allowed' : 'pointer',
          opacity: issue.status === 'Done' ? 0.6 : 1,
        }}
        disabled={issue.status === 'Done' || currentUser.role !== "admin"}
      >
        {issue.status === 'Done' ? 'Resolved' : 'Mark as Resolved'}
      </button>

      <div className="mainPage" style={{ maxWidth: '600px', margin: 'auto', borderTop: '2px solid green' }}>
        <h2>{issue.title}</h2>
        <p><strong>Status:</strong> {issue.status}</p>
        <p>
          <strong>Priority:</strong>{' '}
          {currentUser.role === 'admin' ? (
            <select
              value={issue.priority}
              onChange={(e) => {
                const newPriority = e.target.value as 'low' | 'medium' | 'high';
                setIssues((prev) =>
                  prev.map((i) =>
                    i.id === issue.id ? { ...i, priority: newPriority } : i
                  )
                );
              }}
              style={{
                padding: '4px',
                marginLeft: '10px',
                fontSize: '0.95rem',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            <span style={{ marginLeft: '10px' }}>{issue.priority}</span>
          )}
        </p>

        {/* <p><strong>Priority:</strong> {issue.priority}</p> */}
        <p><strong>Severity:</strong> {issue.severity}</p>
        <p><strong>Assignee:</strong> {issue.assignee}</p>
        <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>

        <div className="tags" style={{ marginTop: '10px', display: 'flex' }}>
          <strong style={{ marginRight: '10px' }}>Tags:</strong>
          <div>
            {issue.tags.map((tag) => (
              <span
                key={tag}
                className="tag"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  marginRight: '4px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
