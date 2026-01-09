// Task ID: T032, T033 - API client with JWT injection and cache invalidation
"use client";

import { Task, TaskCreate, TaskUpdate, ApiError } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Simple in-memory cache for tasks.
 * Per T033: Cache is invalidated on logout.
 */
let tasksCache: Task[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 30000; // 30 seconds

/**
 * T033: Clear cache on logout.
 * Called from AuthForm when user logs out.
 */
export function clearApiCache(): void {
  tasksCache = null;
  cacheTimestamp = null;
}

/**
 * Check if cache is valid.
 */
function isCacheValid(): boolean {
  if (!tasksCache || !cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_TTL;
}

/**
 * Get JWT token for backend API authentication.
 * Per FR-007: System validates token on every protected request.
 *
 * Uses /api/token endpoint which:
 * 1. Validates Better Auth session
 * 2. Returns a JWT signed with BETTER_AUTH_SECRET
 */
async function getAuthToken(): Promise<string | null> {
  try {
    // Fetch JWT from token endpoint (validates session internally)
    const response = await fetch("/api/token", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.token || null;
  } catch {
    return null;
  }
}

/**
 * Make authenticated API request.
 * Per FR-007, FR-008: JWT validation on every request.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  if (!token) {
    throw new ApiRequestError("UNAUTHORIZED", "Not authenticated");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: { code: "UNKNOWN", message: "An error occurred" },
    })) as ApiError;

    throw new ApiRequestError(
      errorData.error.code,
      errorData.error.message,
      errorData.error.details
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Custom error class for API errors.
 */
export class ApiRequestError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.details = details;
  }
}

// ============================================
// Task API Functions
// ============================================

/**
 * Get all tasks for the current user.
 * Per FR-011, FR-012: Filter by user_id, order by created_at DESC.
 */
export async function getTasks(forceRefresh = false): Promise<Task[]> {
  if (!forceRefresh && isCacheValid()) {
    return tasksCache!;
  }

  const tasks = await apiRequest<Task[]>("/tasks");
  tasksCache = tasks;
  cacheTimestamp = Date.now();
  return tasks;
}

/**
 * Create a new task.
 * Per FR-009, FR-010: Create with title (required) and description (optional).
 */
export async function createTask(data: TaskCreate): Promise<Task> {
  const task = await apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // Invalidate cache on mutation
  clearApiCache();
  return task;
}

/**
 * Update an existing task.
 * Per FR-013, FR-014: Partial update, ownership verified.
 */
export async function updateTask(taskId: number, data: TaskUpdate): Promise<Task> {
  const task = await apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  // Invalidate cache on mutation
  clearApiCache();
  return task;
}

/**
 * Delete a task permanently.
 * Per FR-015, FR-016, clarification: Permanent deletion.
 */
export async function deleteTask(taskId: number): Promise<void> {
  await apiRequest<void>(`/tasks/${taskId}`, {
    method: "DELETE",
  });

  // Invalidate cache on mutation
  clearApiCache();
}

/**
 * Mark a task as complete.
 * Per FR-017: Toggle completion status to true.
 */
export async function completeTask(taskId: number): Promise<Task> {
  const task = await apiRequest<Task>(`/tasks/${taskId}/complete`, {
    method: "POST",
  });

  // Invalidate cache on mutation
  clearApiCache();
  return task;
}

/**
 * Mark a task as incomplete.
 * Per FR-017: Toggle completion status to false.
 */
export async function uncompleteTask(taskId: number): Promise<Task> {
  const task = await apiRequest<Task>(`/tasks/${taskId}/complete`, {
    method: "DELETE",
  });

  // Invalidate cache on mutation
  clearApiCache();
  return task;
}
