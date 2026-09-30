import React from 'react';
import { TaskStatus, TaskPriority, IssueStatus, IssuePriority } from '../api/types';

interface StatusBadgeProps {
  status: TaskStatus | IssueStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = 'badge-todo';
  if (status === 'In Progress') badgeClass = 'badge-in-progress';
  else if (status === 'Done' || status === 'Resolved') badgeClass = 'badge-done';
  else if (status === 'Open') badgeClass = 'badge-open';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

interface PriorityBadgeProps {
  priority: TaskPriority | IssuePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let badgeClass = 'badge-medium';
  if (priority === 'Low') badgeClass = 'badge-low';
  else if (priority === 'High') badgeClass = 'badge-high';

  return <span className={`badge ${badgeClass}`}>{priority}</span>;
};
