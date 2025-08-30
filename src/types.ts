export type IssueStatus = 'Backlog' | 'In Progress' | 'Done';
export type IssuePriority = 'low' | 'medium' | 'high';

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

export interface DragableCard {
    issue: Issue,
    isDraggingGlobal: boolean;
    isAdmin: boolean
}

export interface DropableColumnInterface {
      status: IssueStatus;
      issues: Issue[];
      isDraggingGlobal: boolean;
      isAdmin:boolean
    }


export interface ContextType {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  localIssues: Issue[];
  setLocalIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  lastUpdated: String,
  setLastUpdated:React.Dispatch<React.SetStateAction<string>>
}