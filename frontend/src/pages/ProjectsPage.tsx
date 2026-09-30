import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project } from '../api/types';
import { api } from '../api/client';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { IconPlus } from '../components/Icons';

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Confirmation modal state
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (data: { name: string; description: string | null }) => {
    if (editingProject) {
      await api.updateProject(editingProject.id, data);
    } else {
      await api.createProject(data);
    }
    await fetchProjects();
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await api.deleteProject(deletingProject.id);
      setDeletingProject(null);
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const filteredProjects = useMemo(() => {
    if (!filterText.trim()) return projects;
    const q = filterText.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );
  }, [projects, filterText]);

  const totalTasks = useMemo(() => projects.reduce((acc, p) => acc + (p.task_count ?? 0), 0), [projects]);
  const totalIssues = useMemo(() => projects.reduce((acc, p) => acc + (p.issue_count ?? 0), 0), [projects]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Workspaces</h1>
          <p className="page-description">
            Organize development tasks, bug reports, and project health metrics for your local repositories.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <IconPlus size={13} />
          <span>New Project</span>
        </button>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchProjects}
            style={{ marginLeft: '1rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Strip (when projects exist) */}
      {!isLoading && projects.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Workspaces:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{projects.length}</strong>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-default)' }} aria-hidden="true" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Tasks:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-progress)' }}>{totalTasks}</strong>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-default)' }} aria-hidden="true" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Issues:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-open)' }}>{totalIssues}</strong>
          </div>

          {projects.length > 3 && (
            <div style={{ marginLeft: 'auto', minWidth: '220px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem' }}
                placeholder="Filter workspaces..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading project workspaces...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Create your first developer workspace to start organizing tasks and issues.</p>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            Create First Project
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <h3>No matching projects</h3>
          <p>No project workspaces match "{filterText}".</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFilterText('')}>
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelect={onSelectProject}
              onEdit={handleOpenEditModal}
              onDelete={(p) => setDeletingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        project={editingProject}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProject}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All associated tasks and issues will be permanently deleted.`}
        confirmLabel="Delete Project"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
        isDestructive={true}
      />
    </div>
  );
};
