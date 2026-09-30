import React from 'react';
import { Project } from '../api/types';

interface HeaderProps {
  selectedProject: Project | null;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedProject, onNavigateHome }) => {
  return (
    <header className="app-header">
      <div className="brand" onClick={onNavigateHome}>
        <div className="brand-logo">D</div>
        <span className="brand-name">DevTrack</span>
      </div>

      <nav className="nav-breadcrumbs">
        <span
          className={`breadcrumb-link ${!selectedProject ? 'breadcrumb-active' : ''}`}
          onClick={onNavigateHome}
        >
          Projects
        </span>
        {selectedProject && (
          <>
            <span>/</span>
            <span className="breadcrumb-active">{selectedProject.name}</span>
          </>
        )}
      </nav>
    </header>
  );
};
