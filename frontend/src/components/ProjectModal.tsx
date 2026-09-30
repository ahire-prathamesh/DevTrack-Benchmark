import React, { useState, useEffect } from 'react';
import { Project } from '../api/types';
import { IconClose } from './Icons';

interface ProjectModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string | null }) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [project, isOpen]);

  // Keyboard accessibility: Escape key dismisses modal
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
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Project name is required and cannot be empty.');
      return;
    }

    if (trimmedName.length > 100) {
      setError('Project name cannot exceed 100 characters.');
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
        name: trimmedName,
        description: description.trim() ? description.trim() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 id="project-modal-title" className="modal-title">
              {project ? 'Edit Project' : 'New Project'}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              {project ? `Modifying project #${project.id}` : 'Create a workspace to organize tasks and track issues'}
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
            <label htmlFor="project-name" className="form-label">
              Project Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="project-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Infrastructure Engine"
              maxLength={100}
              autoFocus
            />
            <div className="field-meta">
              {error ? <p className="form-error" style={{ margin: 0 }}>{error}</p> : <span />}
              <span className="char-counter">{name.length} / 100</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="project-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="project-desc"
              rows={4}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level objectives, scope, or team notes..."
              maxLength={2000}
            />
            <div className="field-meta">
              <span />
              <span className="char-counter">{description.length} / 2000</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
