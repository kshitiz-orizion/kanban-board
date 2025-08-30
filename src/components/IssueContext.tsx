// src/context/IssueContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFetchIssues } from '../utils/api';
import { toast } from 'react-toastify';

export interface Issue {
  id: string;
  title: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high';
  severity: number;
  createdAt: string;
  assignee: string;
  tags: string[];
}

interface IssueContextType {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: React.ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

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
  
  return (
    <IssueContext.Provider value={{ issues, setIssues }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssueContext = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssueContext must be used within an IssueProvider');
  }
  return context;
};
