import React from 'react';
import { Project } from '../api/types';

interface HeaderProps {
  selectedProject: Project | null;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedProject, onNavigateHome }) => {
  return (
    <header className="app-header">
      <button
        type="button"
        className="brand"
        onClick={onNavigateHome}
        aria-label="DevTrack Home"
      >
        <span className="brand-icon" aria-hidden="true">&gt;_</span>
        <span className="brand-title brand-name">DevTrack</span>
        <span className="brand-badge">local</span>
      </button>

      <nav className="nav-breadcrumbs" aria-label="Breadcrumb navigation">
        <button
          type="button"
          className={`breadcrumb-btn breadcrumb-link ${!selectedProject ? 'breadcrumb-current breadcrumb-active' : ''}`}
          onClick={onNavigateHome}
        >
          Projects
        </button>
        {selectedProject && (
          <>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-current breadcrumb-active" aria-current="page">
              {selectedProject.name}
            </span>
          </>
        )}
      </nav>
    </header>
  );
};
