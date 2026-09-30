import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../api/types';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
  }) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
    } else {
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setPriority('Medium');
    }
    setError(null);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Task title is required and cannot be empty.');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Task title cannot exceed 200 characters.');
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
      setError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="task-modal-title" className="modal-title">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement REST endpoints"
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical notes or acceptance details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="task-status" className="form-label">
                Status
              </label>
              <select
                id="task-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
