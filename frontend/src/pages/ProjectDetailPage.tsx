import React, { useState } from 'react';
import { Project } from '../api/types';
import { TaskList } from '../components/TaskList';
import { IssueList } from '../components/IssueList';
import { DashboardView } from '../components/DashboardView';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onProjectUpdated?: (updated: Project) => void;
}

export type DetailTab = 'dashboard' | 'tasks' | 'issues';

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onProjectUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('dashboard');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBack}
            style={{ marginBottom: '0.75rem' }}
          >
            &larr; Back to Projects
          </button>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {project.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Issues
        </button>
      </div>

      <div id="tab-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            projectId={project.id}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'tasks' && (
          <TaskList
            projectId={project.id}
            onTaskCountChanged={() => {
              if (onProjectUpdated) onProjectUpdated(project);
            }}
          />
        )}
        {activeTab === 'issues' && (
          <IssueList
            projectId={project.id}
            onIssueCountChanged={() => {
              if (onProjectUpdated) onProjectUpdated(project);
            }}
          />
        )}
      </div>
    </div>
  );
};

