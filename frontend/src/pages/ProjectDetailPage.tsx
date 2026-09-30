import React, { useState } from 'react';
import { Project } from '../api/types';
import { TaskList } from '../components/TaskList';
import { IssueList } from '../components/IssueList';
import { DashboardView } from '../components/DashboardView';
import { IconArrowLeft } from '../components/Icons';

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
      {/* Workspace Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          style={{ marginBottom: '0.85rem' }}
          aria-label="Back to project workspaces list"
        >
          <IconArrowLeft size={13} />
          <span>Back to Projects</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <h1 className="page-title" style={{ marginBottom: 0 }}>{project.name}</h1>
              <span className="table-id" style={{ backgroundColor: 'var(--bg-elevated)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)' }}>
                PID #{project.id}
              </span>
            </div>
            <p className="page-description">
              {project.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container" aria-label="Project Sections">
        <button
          type="button"
          id="tab-dashboard"
          aria-selected={activeTab === 'dashboard'}
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          id="tab-tasks"
          aria-selected={activeTab === 'tasks'}
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          type="button"
          id="tab-issues"
          aria-selected={activeTab === 'issues'}
          className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Issues
        </button>
      </div>

      {/* Tab Panels */}
      <div id="tab-content">
        {activeTab === 'dashboard' && (
          <div role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard">
            <DashboardView
              projectId={project.id}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}
        {activeTab === 'tasks' && (
          <div role="tabpanel" id="panel-tasks" aria-labelledby="tab-tasks">
            <TaskList
              projectId={project.id}
              onTaskCountChanged={() => {
                if (onProjectUpdated) onProjectUpdated(project);
              }}
            />
          </div>
        )}
        {activeTab === 'issues' && (
          <div role="tabpanel" id="panel-issues" aria-labelledby="tab-issues">
            <IssueList
              projectId={project.id}
              onIssueCountChanged={() => {
                if (onProjectUpdated) onProjectUpdated(project);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
