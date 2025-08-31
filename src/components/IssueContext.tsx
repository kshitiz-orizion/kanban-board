// src/context/Context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFetchIssues } from '../utils/api';
import { toast } from 'react-toastify';
import { Issue, ContextType } from '../types';
import { usePolling } from '../hooks/polling';


const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [localIssues,setLocalIssues] = useState<Issue[]>([]);
  const [lastUpdated,setLastUpdated] = useState('');
  const [counter,setCounter] = useState<number>(1000);
  // console.log("provider updated")
  useEffect(() => {
      fetchData();
    }, []);

  usePolling(() => {
  fetchNewPollData();
}, 10000);

const fetchNewPollData = () =>{
  const data = [...issues]
  const filteredServerIssues = data.filter(
      (issue) => !localIssues.some(local => local.id === issue.id)
    );
  setIssues([...filteredServerIssues, ...localIssues]);
  setLocalIssues([])
  setLastUpdated(Date.now().toString())
  // setIssues((prev)=>[...prev,...localIssues])
}
  
    const fetchData = async () => {
      try {
        const data: Issue[]|any = await mockFetchIssues();
        setIssues(data);
      } catch (error) {
        toast("Failed to load issues");
      }
    };
  
  return (
    <Context.Provider value={{ issues, setIssues, localIssues,setLocalIssues, lastUpdated,setLastUpdated, counter,setCounter }}>
      {children}
    </Context.Provider>
  );
};

export const useIssueContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useIssueContext must be used within an IssueProvider');
  }
  return context;
};
