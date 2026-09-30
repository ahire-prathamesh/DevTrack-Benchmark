import React, { useState, useEffect, useCallback } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { IssueModal } from './IssueModal';
import { ConfirmationModal } from './ConfirmationModal';
import { IconPlus, IconEdit, IconTrash } from './Icons';

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

  const isFiltering = statusFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <div>
      {/* Controls Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search issues by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
            aria-label="Search issues by title"
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

          {isFiltering && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingIssue(null);
            setIsModalOpen(true);
          }}
        >
          <IconPlus size={13} />
          <span>New Issue</span>
        </button>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues found</h3>
          <p>
            {isFiltering
              ? 'No issues match the active title query or status filter.'
              : 'No open bugs or defects recorded yet. Track new findings with "+ New Issue".'}
          </p>
          {isFiltering && (
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
        /* High-Density Engineering Table */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Issue Details</th>
                <th style={{ width: '150px' }}>Status</th>
                <th style={{ width: '130px' }}>Priority</th>
                <th style={{ width: '130px' }}>Created</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="table-id">#{issue.id}</td>
                  <td>
                    <h4 className="table-title">{issue.title}</h4>
                    {issue.description && (
                      <p className="table-desc">{issue.description}</p>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={issue.status} />
                  </td>
                  <td>
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="table-date">
                    {new Date(issue.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingIssue(issue);
                          setIsModalOpen(true);
                        }}
                        aria-label={`Edit issue ${issue.title}`}
                      >
                        <IconEdit size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeletingIssue(issue)}
                        aria-label={`Delete issue ${issue.title}`}
                      >
                        <IconTrash size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        message={`Are you sure you want to delete issue "${deletingIssue?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Issue"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingIssue(null)}
        isDestructive={true}
      />
    </div>
  );
};
