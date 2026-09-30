import React, { useState } from 'react';
import { Project } from './api/types';
import { Header } from './components/Header';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="app-container">
      <Header
        selectedProject={selectedProject}
        onNavigateHome={() => setSelectedProject(null)}
      />

      <main className="main-content">
        {!selectedProject ? (
          <ProjectsPage onSelectProject={(project) => setSelectedProject(project)} />
        ) : (
          <ProjectDetailPage
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            onProjectUpdated={(updated) => setSelectedProject(updated)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
