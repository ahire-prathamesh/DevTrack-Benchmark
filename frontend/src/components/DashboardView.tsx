import React, { useEffect, useState, useCallback } from 'react';
import { DashboardData } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';

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
    return <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading dashboard metrics...</p>;
  }

  if (error || !data) {
    return (
      <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', marginBottom: '1.25rem' }}>
        {error || 'Unable to display dashboard data.'}
      </div>
    );
  }

  const { task_metrics, issue_metrics, recent_tasks, recent_issues } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Total Tasks
            </span>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('tasks')}
              >
                View Tasks &rarr;
              </button>
            )}
          </div>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {task_metrics.total}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Todo: <strong>{task_metrics.by_status['Todo'] || 0}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>&bull;</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              In Progress: <strong>{task_metrics.by_status['In Progress'] || 0}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>&bull;</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Done: <strong>{task_metrics.by_status['Done'] || 0}</strong>
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Total Issues
            </span>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('issues')}
              >
                View Issues &rarr;
              </button>
            )}
          </div>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {issue_metrics.total}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Open: <strong>{issue_metrics.by_status['Open'] || 0}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>&bull;</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              In Progress: <strong>{issue_metrics.by_status['In Progress'] || 0}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>&bull;</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Resolved: <strong>{issue_metrics.by_status['Resolved'] || 0}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Items Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Recent Tasks Column */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Tasks</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest up to 5</span>
          </div>

          {recent_tasks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No tasks tracked yet in this project.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent_tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{task.title}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PriorityBadge priority={task.priority} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues Column */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Issues</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest up to 5</span>
          </div>

          {recent_issues.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No issues tracked yet in this project.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent_issues.map((issue) => (
                <div
                  key={issue.id}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{issue.title}</span>
                    <StatusBadge status={issue.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PriorityBadge priority={issue.priority} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
