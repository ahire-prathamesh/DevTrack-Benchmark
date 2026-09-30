import React, { useEffect, useState, useCallback } from 'react';
import { DashboardData } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { IconArrowRight } from './Icons';

interface DashboardViewProps {
  projectId: number;
  onNavigateTab?: (tab: 'tasks' | 'issues') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ projectId, onNavigateTab }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getDashboard(projectId);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading) {
    return (
      <div className="empty-state" style={{ borderStyle: 'solid' }}>
        <h3>Loading project telemetry...</h3>
        <p>Fetching task and issue metrics from database.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert-error" role="alert">
        <strong>Telemetry Error:</strong> {error || 'Unable to display dashboard data.'}
      </div>
    );
  }

  const { task_metrics, issue_metrics, recent_tasks, recent_issues } = data;

  return (
    <div className="dashboard-container">
      {/* Top Metric KPI Cards */}
      <div className="metrics-grid">
        {/* Task Metrics */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Tasks</span>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('tasks')}
                aria-label="View all tasks"
              >
                <span>Tasks Tab</span>
                <IconArrowRight size={12} />
              </button>
            )}
          </div>

          <div className="metric-main">
            <span className="metric-number">{task_metrics.total}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>registered items</span>
          </div>

          <div className="metric-status-row" aria-label="Task status breakdown">
            <span className="metric-pill">
              <span>Todo:</span>
              <strong>{task_metrics.by_status['Todo'] || 0}</strong>
            </span>
            <span className="metric-pill">
              <span>In Progress:</span>
              <strong>{task_metrics.by_status['In Progress'] || 0}</strong>
            </span>
            <span className="metric-pill">
              <span>Done:</span>
              <strong>{task_metrics.by_status['Done'] || 0}</strong>
            </span>
          </div>
        </div>

        {/* Issue Metrics */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Issues</span>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('issues')}
                aria-label="View all issues"
              >
                <span>Issues Tab</span>
                <IconArrowRight size={12} />
              </button>
            )}
          </div>

          <div className="metric-main">
            <span className="metric-number">{issue_metrics.total}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>logged reports</span>
          </div>

          <div className="metric-status-row" aria-label="Issue status breakdown">
            <span className="metric-pill">
              <span>Open:</span>
              <strong>{issue_metrics.by_status['Open'] || 0}</strong>
            </span>
            <span className="metric-pill">
              <span>In Progress:</span>
              <strong>{issue_metrics.by_status['In Progress'] || 0}</strong>
            </span>
            <span className="metric-pill">
              <span>Resolved:</span>
              <strong>{issue_metrics.by_status['Resolved'] || 0}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Items Dual Panel Grid */}
      <div className="recent-panels-grid">
        {/* Recent Tasks */}
        <div className="recent-panel">
          <div className="recent-panel-header">
            <h3>Recent Tasks</h3>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Latest 5
            </span>
          </div>

          {recent_tasks.length === 0 ? (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No tasks tracked yet in this project.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" aria-label="Recent tasks table">
                <thead>
                  <tr>
                    <th style={{ width: '4rem' }}>ID</th>
                    <th>Task</th>
                    <th style={{ width: '7rem' }}>Status</th>
                    <th style={{ width: '6rem' }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="table-id">#{task.id}</td>
                      <td>
                        <div className="table-title">{task.title}</div>
                        {task.description && <div className="table-desc">{task.description}</div>}
                      </td>
                      <td>
                        <StatusBadge status={task.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={task.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="recent-panel">
          <div className="recent-panel-header">
            <h3>Recent Issues</h3>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Latest 5
            </span>
          </div>

          {recent_issues.length === 0 ? (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No issues tracked yet in this project.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" aria-label="Recent issues table">
                <thead>
                  <tr>
                    <th style={{ width: '4rem' }}>ID</th>
                    <th>Issue</th>
                    <th style={{ width: '7rem' }}>Status</th>
                    <th style={{ width: '6rem' }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="table-id">#{issue.id}</td>
                      <td>
                        <div className="table-title">{issue.title}</div>
                        {issue.description && <div className="table-desc">{issue.description}</div>}
                      </td>
                      <td>
                        <StatusBadge status={issue.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={issue.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
