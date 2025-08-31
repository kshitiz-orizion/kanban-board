// src/hooks/useMockInsertIssues.ts
import { useEffect } from 'react';
import { Issue } from '../types';
import { useIssueContext } from '../components/IssueContext';

//  let counter = 1000; // ensure unique IDs

const generateMockIssue = (counter:number): Issue => {

    // const newCounter=counter+1;
    return {
    id: String(counter),
    title: `New Issue #${counter}`,
    status: ['Backlog', 'In Progress', 'Done'][Math.floor(Math.random() * 3)] as Issue['status'],
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Issue['priority'],
    severity: Math.ceil(Math.random() * 5),
    createdAt: new Date().toISOString(),
    assignee: 'Bot generated issue',
    tags: ['auto', 'generated'],
}
};
// inserts bot generated issues with 50% chance in 10 seconds

export const useMockInsertIssues = (interval = 10000, chance = 0.5) => {
    const { setLocalIssues,counter,setCounter } = useIssueContext();
    useEffect(() => {
        const id = setInterval(() => {
            if (Math.random() < chance) {
                const newIssue = {
                    ...generateMockIssue(counter),
                     isLocal: true,
                };
                setLocalIssues(prev => [...prev, newIssue]);
                setCounter(counter+1)
                console.log(counter,'Mock issue inserted:', newIssue);
            }
        }, interval);

        return () => clearInterval(id);
    }, [setLocalIssues, interval, chance,counter]);
};
