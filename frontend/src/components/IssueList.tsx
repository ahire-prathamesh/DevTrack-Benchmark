import React, { useState, useEffect, useCallback } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { IssueModal } from './IssueModal';
import { ConfirmationModal } from './ConfirmationModal';

interface IssueListProps {
  projectId: number;
  onIssueCountChanged?: () => void;
}

export const IssueList: React.FC<IssueListProps> = ({ projectId, onIssueCountChanged }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: { status?: string; search?: string } = {};
      if (statusFilter !== 'All') {
        filter.status = statusFilter;
      }
      if (searchQuery.trim()) {
        filter.search = searchQuery.trim();
      }
      const data = await api.getIssues(projectId, filter);
      setIssues(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, statusFilter, searchQuery]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleSaveIssue = async (data: {
    title: string;
    description: string | null;
    status: IssueStatus;
    priority: IssuePriority;
  }) => {
    if (editingIssue) {
      await api.updateIssue(editingIssue.id, data);
    } else {
      await api.createIssue(projectId, data);
    }
    await fetchIssues();
    if (onIssueCountChanged) onIssueCountChanged();
  };

  const handleConfirmDelete = async () => {
    if (!deletingIssue) return;
    try {
      await api.deleteIssue(deletingIssue.id);
      setDeletingIssue(null);
      await fetchIssues();
      if (onIssueCountChanged) onIssueCountChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete issue.');
    }
  };

  return (
    <div>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search issues by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
          />

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            style={{ flex: 1 }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingIssue(null);
            setIsModalOpen(true);
          }}
        >
          + New Issue
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading issues...</p>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues found</h3>
          <p>
            {statusFilter !== 'All' || searchQuery
              ? 'No issues match the selected search or filter criteria.'
              : 'No issues tracked yet. Click "+ New Issue" to report a bug or enhancement.'}
          </p>
          {(statusFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
              }}
            >
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{issue.title}</h4>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
                {issue.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {issue.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingIssue(issue);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeletingIssue(issue)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Modal */}
      <IssueModal
        isOpen={isModalOpen}
        issue={editingIssue}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveIssue}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingIssue}
        title="Delete Issue"
        message={`Are you sure you want to delete issue "${deletingIssue?.title}"?`}
        confirmLabel="Delete Issue"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingIssue(null)}
        isDestructive={true}
      />
    </div>
  );
};
