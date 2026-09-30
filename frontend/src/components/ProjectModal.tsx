import React, { useState, useEffect } from 'react';
import { Project } from '../api/types';

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
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="project-modal-title" className="modal-title">
            {project ? 'Edit Project' : 'New Project'}
          </h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name" className="form-label">
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Developer Tracker Benchmark"
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="project-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="project-desc"
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of project goals..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
