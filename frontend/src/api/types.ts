export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  task_count?: number;
  issue_count?: number;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
}

export interface Issue {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  created_at: string;
}

export interface TaskMetrics {
  total: number;
  by_status: Record<TaskStatus, number>;
}

export interface IssueMetrics {
  total: number;
  by_status: Record<IssueStatus, number>;
}

export interface DashboardData {
  project: Project;
  task_metrics: TaskMetrics;
  issue_metrics: IssueMetrics;
  recent_tasks: Task[];
  recent_issues: Issue[];
}

export interface ApiErrorDetail {
  field: string;
  issue: string;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details: ApiErrorDetail[];
  };
}
