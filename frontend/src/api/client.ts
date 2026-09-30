import {
  Project,
  Task,
  Issue,
  DashboardData,
  ApiErrorDetail,
  ApiErrorEnvelope,
  TaskStatus,
  TaskPriority,
  IssueStatus,
  IssuePriority,
} from './types';

export class ApiClientError extends Error {
  code: string;
  details: ApiErrorDetail[];
  statusCode: number;

  constructor(code: string, message: string, details: ApiErrorDetail[] = [], statusCode: number = 400) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers = new Headers(options.headers || {});
  
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && data.error) {
      const err = data as ApiErrorEnvelope;
      throw new ApiClientError(
        err.error.code,
        err.error.message,
        err.error.details || [],
        response.status
      );
    }
    throw new ApiClientError(
      'REQUEST_FAILED',
      response.statusText || `Request failed with status ${response.status}`,
      [],
      response.status
    );
  }

  return data as T;
}

export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/api/projects');
  },

  async createProject(payload: { name: string; description?: string | null }): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getProject(id: number): Promise<Project> {
    return request<Project>(`/api/projects/${id}`);
  },

  async updateProject(id: number, payload: { name: string; description?: string | null }): Promise<Project> {
    return request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteProject(id: number): Promise<void> {
    return request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Dashboard
  async getDashboard(projectId: number): Promise<DashboardData> {
    return request<DashboardData>(`/api/projects/${projectId}/dashboard`);
  },

  // Tasks
  async getTasks(projectId: number, filter?: { status?: string; search?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.search) params.set('search', filter.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Task[]>(`/api/projects/${projectId}/tasks${qs}`);
  },

  async createTask(
    projectId: number,
    payload: { title: string; description?: string | null; status?: TaskStatus; priority?: TaskPriority }
  ): Promise<Task> {
    return request<Task>(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getTask(id: number): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`);
  },

  async updateTask(
    id: number,
    payload: { title: string; description?: string | null; status: TaskStatus; priority: TaskPriority }
  ): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteTask(id: number): Promise<void> {
    return request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Issues
  async getIssues(projectId: number, filter?: { status?: string; search?: string }): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.search) params.set('search', filter.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Issue[]>(`/api/projects/${projectId}/issues${qs}`);
  },

  async createIssue(
    projectId: number,
    payload: { title: string; description?: string | null; status?: IssueStatus; priority?: IssuePriority }
  ): Promise<Issue> {
    return request<Issue>(`/api/projects/${projectId}/issues`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getIssue(id: number): Promise<Issue> {
    return request<Issue>(`/api/issues/${id}`);
  },

  async updateIssue(
    id: number,
    payload: { title: string; description?: string | null; status: IssueStatus; priority: IssuePriority }
  ): Promise<Issue> {
    return request<Issue>(`/api/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteIssue(id: number): Promise<void> {
    return request<void>(`/api/issues/${id}`, {
      method: 'DELETE',
    });
  },
};
