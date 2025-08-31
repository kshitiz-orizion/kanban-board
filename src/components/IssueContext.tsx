// src/context/Context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFetchIssues } from '../utils/api';
import { toast } from 'react-toastify';
import { Issue, ContextType } from '../types';
import { usePolling } from '../hooks/polling';
import { sortIssues } from '../utils/sorting';


const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [localIssues,setLocalIssues] = useState<Issue[]>([]);
  const [lastUpdated,setLastUpdated] = useState('');
  const [counter,setCounter] = useState<number>(1000);
  const [pollInterval,setPollInterval]= useState<number|''>(10);
  
  const pollValue = Number(pollInterval) || 0
  useEffect(() => {
      fetchData();
    }, []);

  usePolling(() => {
    console.log("===called====?")
  fetchNewPollData();
},  pollValue * 1000);

const fetchNewPollData = () =>{
  const data = [...issues]
  const filteredServerIssues = data.filter(
      (issue) => !localIssues.some(local => local.id === issue.id)
    );
  const unsortedIssue = [...filteredServerIssues,...localIssues];
  const sortedIssue = sortIssues(unsortedIssue)
  setIssues([...sortedIssue]);
  setLocalIssues([])
  setLastUpdated(Date.now().toString())
  // setIssues((prev)=>[...prev,...localIssues])
}
  
    const fetchData = async () => {
      try {
        const data: Issue[]|any = await mockFetchIssues();
        const sortedIssue = sortIssues(data)
        setIssues([...sortedIssue]);
      } catch (error) {
        toast("Failed to load issues");
      }
    };
  
  return (
    <Context.Provider value={{ issues, setIssues, localIssues,setLocalIssues, lastUpdated,setLastUpdated, counter,setCounter,pollInterval,setPollInterval }}>
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
