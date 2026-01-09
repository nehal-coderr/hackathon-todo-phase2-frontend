// Task ID: T015 - Shared TypeScript types
// Per contracts/api-v1.yaml and data-model.md

/**
 * Task entity as returned from API
 * Per FR-019: user_id is not exposed in API responses
 */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Task creation payload
 * Per FR-010: title required (1-200 chars), description optional
 */
export interface TaskCreate {
  title: string;
  description?: string | null;
}

/**
 * Task update payload (all fields optional)
 * Per FR-013: Allow partial updates
 */
export interface TaskUpdate {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
}

/**
 * API Error response format
 * Per contracts/api-v1.yaml Error schema
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * User type from Better Auth
 */
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

/**
 * Auth session type
 */
export interface Session {
  user: User;
  token: string;
}
