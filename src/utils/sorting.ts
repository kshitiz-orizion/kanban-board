
import { Issue } from "../types";


export function sortIssues(
  issues: Issue[],
  userDefinedRank: number = 1
): Issue[] {
  const today = new Date();

  const scoredIssues: Issue[] = issues.map((issue) => {
    const createdAt = new Date(issue.createdAt);
    const timeDiff = today.getTime() - createdAt.getTime();
    const daysSinceCreated = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // ms to days


    const score = issue.severity * 10 + (daysSinceCreated * -1) + userDefinedRank;

    return {
      ...issue,
      score,
    };
  });

  scoredIssues.sort((a, b) => (b.score || 0) - (a.score || 0));

  return scoredIssues;
}
