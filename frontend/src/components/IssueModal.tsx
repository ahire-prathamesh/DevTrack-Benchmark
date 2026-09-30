import React, { useState, useEffect } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../api/types';

interface IssueModalProps {
  isOpen: boolean;
  issue?: Issue | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string | null;
    status: IssueStatus;
    priority: IssuePriority;
  }) => Promise<void>;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  issue,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('Open');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description || '');
      setStatus(issue.status);
      setPriority(issue.priority);
    } else {
      setTitle('');
      setDescription('');
      setStatus('Open');
      setPriority('Medium');
    }
    setError(null);
  }, [issue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Issue title is required and cannot be empty.');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Issue title cannot exceed 200 characters.');
      return;
    }

    if (description.trim().length > 2000) {
      setError('Description cannot exceed 2000 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() ? description.trim() : null,
        status,
        priority,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="issue-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="issue-modal-title" className="modal-title">
            {issue ? 'Edit Issue' : 'New Issue'}
          </h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issue-title" className="form-label">
              Issue Title *
            </label>
            <input
              id="issue-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken styling on Safari"
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="issue-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="issue-desc"
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce, environment, error details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="issue-status" className="form-label">
                Status
              </label>
              <select
                id="issue-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="issue-priority" className="form-label">
                Priority
              </label>
              <select
                id="issue-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : issue ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
