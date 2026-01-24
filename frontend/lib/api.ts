import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Base API client with JWT handling
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('API Client initialized with URL:', this.baseUrl);
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    console.log('API Request:', url, config); // Debugging log

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.handleTokenExpiration();
        throw new Error('Authentication required');
      }

      if (response.status === 204) return {} as unknown as T;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }

      const text = await response.text();
      if (!text) return {} as unknown as T;
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  private handleTokenExpiration(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
      window.location.href = '/auth/sign-in';
    }
  }

  // Auth
  async signIn(email: string, password: string): Promise<{ user: any; token: string }> {
    const response = await fetch(`${this.baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Sign in failed');
    }

    const data = await response.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_name', data.user?.full_name || data.user?.name || '');
    }
    return data;
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: any; token: string }> {
    const response = await fetch(`${this.baseUrl}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Sign up failed');
    }

    const data = await response.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_name', data.user?.full_name || data.user?.name || name);
    }
    return data;
  }

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
    }
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Todos
  async getTodos(): Promise<Todo[]> {
    const todos = await this.request<any[]>('/todos/');
    return todos.map(this.mapTaskToTodo);
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const task = await this.request<any>('/todos/', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
    return this.mapTaskToTodo(task);
  }

  async updateTodo(id: number, todoData: UpdateTodoRequest): Promise<Todo> {
    const task = await this.request<any>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
    return this.mapTaskToTodo(task);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.request(`/todos/${id}`, { method: 'DELETE' });
  }

  async toggleTodoComplete(id: number, completed: boolean): Promise<Todo> {
    const task = await this.request<any>(`/todos/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
    return this.mapTaskToTodo(task);
  }

  private mapTaskToTodo(task: any): Todo {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      userId: task.user_id,
    };
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Convenience exports
export const signIn = apiClient.signIn.bind(apiClient);
export const signUp = apiClient.signUp.bind(apiClient);
export const signOut = apiClient.signOut.bind(apiClient);
export const getTodos = apiClient.getTodos.bind(apiClient);
export const createTodo = apiClient.createTodo.bind(apiClient);
export const updateTodo = apiClient.updateTodo.bind(apiClient);
export const deleteTodo = apiClient.deleteTodo.bind(apiClient);
export const toggleTodoComplete = apiClient.toggleTodoComplete.bind(apiClient);
