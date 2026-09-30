import React from 'react';
import { Project } from '../api/types';
import { IconArrowRight, IconEdit, IconTrash } from './Icons';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              lineHeight: 1.3,
            }}
            onClick={() => onSelect(project)}
          >
            {project.name}
          </h3>
          <span className="table-date" style={{ marginLeft: '0.5rem' }}>{formattedDate}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', minHeight: '2.4rem', lineHeight: 1.45 }}>
          {project.description || 'No description provided.'}
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tasks:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{project.task_count ?? 0}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Issues:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{project.issue_count ?? 0}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onSelect(project)}
          aria-label={`Open workspace for ${project.name}`}
        >
          <span>View Workspace</span>
          <IconArrowRight size={12} />
        </button>
        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            aria-label={`Edit ${project.name}`}
          >
            <IconEdit size={12} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            aria-label={`Delete ${project.name}`}
          >
            <IconTrash size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
