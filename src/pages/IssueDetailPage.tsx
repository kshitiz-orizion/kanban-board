import React from 'react';
import {useParams,Link} from 'react-router-dom';

// export const IssueDetailPage = () => {
//     const {id} = useParams();
//     return <div style={{padding: '1rem'}}>TODO: Implement detail view for issue #{id}</div>;
// };

// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
import IssuesList from '../data/issues.json';

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

const Issues: Issue[] = IssuesList as Issue[];

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const issue = Issues.find((issue) => issue.id === id);

  if (!issue) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Issue not found</h2>
        <Link to="/">Back to Board</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
      {/* <Link to="/" style={{ textDecoration: 'underline', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Board
      </Link> */}
      <h2>{issue.title}</h2>
      <p><strong>Status:</strong> {issue.status}</p>
      <p><strong>Priority:</strong> {issue.priority}</p>
      <p><strong>Severity:</strong> {issue.severity}</p>
      <p><strong>Assignee:</strong> {issue.assignee}</p>
      <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
      <div className="tags" style={{ marginTop: '10px', display:'flex' }}>
        <strong style={{marginRight:'10px'}}>Tags:</strong>
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
  );
};
