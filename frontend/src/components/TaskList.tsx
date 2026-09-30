import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { TaskModal } from './TaskModal';
import { ConfirmationModal } from './ConfirmationModal';

interface TaskListProps {
  projectId: number;
  onTaskCountChanged?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId, onTaskCountChanged }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: { status?: string; search?: string } = {};
      if (statusFilter !== 'All') {
        filter.status = statusFilter;
      }
      if (searchQuery.trim()) {
        filter.search = searchQuery.trim();
      }
      const data = await api.getTasks(projectId, filter);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, statusFilter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSaveTask = async (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
  }) => {
    if (editingTask) {
      await api.updateTask(editingTask.id, data);
    } else {
      await api.createTask(projectId, data);
    }
    await fetchTasks();
    if (onTaskCountChanged) onTaskCountChanged();
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await api.deleteTask(deletingTask.id);
      setDeletingTask(null);
      await fetchTasks();
      if (onTaskCountChanged) onTaskCountChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  return (
    <div>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
          />

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            style={{ flex: 1 }}
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          + New Task
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {statusFilter !== 'All' || searchQuery
              ? 'No tasks match the selected search or filter criteria.'
              : 'Get started by creating your first task in this project.'}
          </p>
          {(statusFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
              }}
            >
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
                {task.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {task.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeletingTask(task)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingTask}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deletingTask?.title}"?`}
        confirmLabel="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isDestructive={true}
      />
    </div>
  );
};
