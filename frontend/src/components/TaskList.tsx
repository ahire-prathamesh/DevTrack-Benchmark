import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '../api/types';
import { api } from '../api/client';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { TaskModal } from './TaskModal';
import { ConfirmationModal } from './ConfirmationModal';
import { IconPlus, IconEdit, IconTrash } from './Icons';

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

  const isFiltering = statusFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <div>
      {/* Controls Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
            aria-label="Search tasks by title"
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

          {isFiltering && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          <IconPlus size={13} />
          <span>New Task</span>
        </button>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {isFiltering
              ? 'No tasks match the active title query or status filter.'
              : 'Keep track of engineering work by creating your first task in this workspace.'}
          </p>
          {isFiltering && (
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
        /* High-Density Engineering Table */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Task Details</th>
                <th style={{ width: '150px' }}>Status</th>
                <th style={{ width: '130px' }}>Priority</th>
                <th style={{ width: '130px' }}>Created</th>
                <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="table-id">#{task.id}</td>
                  <td>
                    <h4 className="table-title">{task.title}</h4>
                    {task.description && (
                      <p className="table-desc">{task.description}</p>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="table-date">
                    {new Date(task.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        aria-label={`Edit task ${task.title}`}
                      >
                        <IconEdit size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeletingTask(task)}
                        aria-label={`Delete task ${task.title}`}
                      >
                        <IconTrash size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        message={`Are you sure you want to delete task "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isDestructive={true}
      />
    </div>
  );
};
