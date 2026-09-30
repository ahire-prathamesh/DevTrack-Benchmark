import React from 'react';
import { TaskStatus, TaskPriority, IssueStatus, IssuePriority } from '../api/types';
import {
  IconStatusTodo,
  IconStatusInProgress,
  IconStatusDone,
  IconStatusOpen,
  IconPriorityHigh,
  IconPriorityMed,
  IconPriorityLow,
} from './Icons';

interface StatusBadgeProps {
  status: TaskStatus | IssueStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = 'badge-todo';
  let IconComponent = IconStatusTodo;

  if (status === 'In Progress') {
    badgeClass = 'badge-in-progress';
    IconComponent = IconStatusInProgress;
  } else if (status === 'Done' || status === 'Resolved') {
    badgeClass = 'badge-done';
    IconComponent = IconStatusDone;
  } else if (status === 'Open') {
    badgeClass = 'badge-open';
    IconComponent = IconStatusOpen;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <IconComponent size={11} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TaskPriority | IssuePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let badgeClass = 'badge-medium';
  let IconComponent = IconPriorityMed;

  if (priority === 'Low') {
    badgeClass = 'badge-low';
    IconComponent = IconPriorityLow;
  } else if (priority === 'High') {
    badgeClass = 'badge-high';
    IconComponent = IconPriorityHigh;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <IconComponent size={10} aria-hidden="true" />
      <span>{priority}</span>
    </span>
  );
};
