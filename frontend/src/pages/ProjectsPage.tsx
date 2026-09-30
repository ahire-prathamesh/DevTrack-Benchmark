import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../api/types';
import { api } from '../api/client';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage software workspaces, tasks, and issue trackers.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
          + New Project
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Create your first developer workspace to start organizing tasks and issues.</p>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            Create First Project
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {projects.map((proj) => (
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
