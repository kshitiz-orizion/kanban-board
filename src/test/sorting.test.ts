import { sortIssues } from '../utils/sorting';
import { Issue } from '../types';

  const issues: Issue[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'Backlog',
      priority: 'high',
      severity: 3,
      createdAt: '2025-08-29T10:00:00Z', // 2 days ago
      assignee: 'alice',
      tags: ['auth', 'bug'],
    },
    {
      id: '2',
      title: 'Improve dashboard loading',
      status: 'In Progress',
      priority: 'medium',
      severity: 2,
      createdAt: '2025-08-25T12:00:00Z', // 6 days ago
      assignee: 'bob',
      tags: ['performance'],
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'Done',
      priority: 'low',
      severity: 1,
      createdAt: '2025-08-20T09:30:00Z', // 11 days ago
      assignee: 'carol',
      tags: ['ui'],
    },
  ];

describe('sortIssues with userDefinedRank as number', () => {
  const baseDate = new Date('2025-08-31T00:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(baseDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('sorts issues by score descending with default userDefinedRank=1', () => {
    const sorted = sortIssues(issues);

    // Scores:
    // Issue 1: 3*10 - 2 + 1 = 29
    // Issue 2: 2*10 - 6 + 1 = 15
    // Issue 3: 1*10 - 11 + 1 = 0

    expect(sorted[0].id).toBe('1');
    expect(sorted[1].id).toBe('2');
    expect(sorted[2].id).toBe('3');
  });

  it('sorts issues correctly with a custom userDefinedRank', () => {
    const rank = 5;
    const sorted = sortIssues(issues, rank);

    // Scores:
    // Issue 1: 3*10 - 2 + 5 = 33
    // Issue 2: 2*10 - 6 + 5 = 19
    // Issue 3: 1*10 - 11 + 5 = 4

    expect(sorted[0].id).toBe('1');
    expect(sorted[1].id).toBe('2');
    expect(sorted[2].id).toBe('3');
  });

  it('adds a score property to each issue', () => {
    const sorted = sortIssues(issues);

    sorted.forEach(issue => {
      expect(issue.score).toBeDefined();
      expect(typeof issue.score).toBe('number');
    });
  });

  it('handles empty issue list', () => {
    const sorted = sortIssues([]);
    expect(sorted).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const issuesCopy = [...issues];
    const sorted = sortIssues(issuesCopy);

    expect(sorted).not.toBe(issuesCopy);
    expect(issuesCopy).toEqual(issues);
  });
});
