import React, { useState, useEffect } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../api/types';
import { IconClose } from './Icons';

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

  // Keyboard navigation & accessibility: Escape key dismisses modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 id="issue-modal-title" className="modal-title">
              {issue ? 'Edit Issue' : 'New Issue'}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              {issue ? `Modifying issue #${issue.id}` : 'Record a bug, defect, or blocker report'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <IconClose size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issue-title" className="form-label">
              Issue Title <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken layout on Safari iOS"
              maxLength={200}
              autoFocus
            />
            <div className="field-meta">
              {error ? <p className="form-error" style={{ margin: 0 }}>{error}</p> : <span />}
              <span className="char-counter">{title.length} / 200</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="issue-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="issue-desc"
              rows={4}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce, stack trace, error logs, or environment details..."
              maxLength={2000}
            />
            <div className="field-meta">
              <span />
              <span className="char-counter">{description.length} / 2000</span>
            </div>
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
              {isSubmitting ? 'Saving...' : issue ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
