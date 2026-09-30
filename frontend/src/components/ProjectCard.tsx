import React from 'react';
import { Project } from '../api/types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3
            style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            onClick={() => onSelect(project)}
          >
            {project.name}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '2.5rem' }}>
          {project.description || 'No description provided.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <span>
            Tasks: <strong>{project.task_count ?? 0}</strong>
          </span>
          <span>
            Issues: <strong>{project.issue_count ?? 0}</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onSelect(project)}
        >
          View Workspace &rarr;
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
