// Task ID: T039, T045, T055, T060, T066, T075 - Dashboard page with full CRUD and toast notifications
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  uncompleteTask,
  clearApiCache,
} from "@/lib/api";
import { Task, TaskCreate, TaskUpdate } from "@/types";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/components/Toast";

/**
 * Dashboard page for authenticated users.
 *
 * Task ID: T039 - Integrate TaskForm with API client
 * Task ID: T045 - Create dashboard page
 * Task ID: T055 - Call PATCH endpoint on save (via TaskItem)
 * Task ID: T060 - Call DELETE endpoint on click (via TaskItem)
 * Task ID: T066 - Call complete/incomplete endpoint on toggle (via TaskItem)
 *
 * Per User Story 3: User can create tasks
 * Per User Story 4: User can view their tasks
 * Per User Story 5: User can edit tasks
 * Per User Story 6: User can delete tasks
 * Per User Story 7: User can toggle task completion
 */
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const toast = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tasks from API.
   */
  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const fetchedTasks = await getTasks(true); // Force refresh
      setTasks(fetchedTasks);
    } catch (err) {
      if (err instanceof Error) {
        // Handle auth errors by redirecting to login
        if (err.message.includes("UNAUTHORIZED") || err.message.includes("Not authenticated")) {
          router.push("/login");
          return;
        }
        setError(err.message);
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Handle task creation.
   * T039: Integrate TaskForm with API client.
   * T075: Show toast notification on success/error.
   */
  const handleCreateTask = async (data: TaskCreate) => {
    setIsCreating(true);
    setError(null);

    try {
      const newTask = await createTask(data);
      // Add new task to the beginning of the list (newest first)
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create task";
      toast.error(message);
      throw err; // Let TaskForm handle the error display too
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Handle task update.
   * T055: Called when TaskItem saves changes.
   * T075: Show toast notification on success/error.
   */
  const handleUpdateTask = async (taskId: number, data: TaskUpdate) => {
    try {
      const updatedTask = await updateTask(taskId, data);
      // Update task in list
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      toast.success("Task updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task";
      toast.error(message);
      throw err;
    }
  };

  /**
   * Handle task deletion.
   * T060: Called when TaskItem delete button is clicked.
   * T061: Remove task from UI immediately.
   * T075: Show toast notification on success/error.
   */
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      // Remove task from list immediately
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete task";
      toast.error(message);
      throw err;
    }
  };

  /**
   * Handle task completion toggle.
   * T066: Called when TaskItem toggle is clicked.
   * T067: Update UI immediately.
   * T075: Show toast notification on success/error.
   */
  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    try {
      const updatedTask = isCompleted
        ? await completeTask(taskId)
        : await uncompleteTask(taskId);
      // Update task in list
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      toast.success(isCompleted ? "Task marked as complete" : "Task marked as incomplete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task";
      toast.error(message);
      throw err;
    }
  };

  /**
   * Handle logout with cache invalidation.
   * Per T033: Clear cache on logout.
   */
  const handleLogout = async () => {
    clearApiCache(); // T033: Cache invalidation
    await signOut();
    router.push("/login");
  };

  // Check authentication and fetch tasks on mount
  useEffect(() => {
    if (!isSessionLoading) {
      if (!session?.user) {
        router.push("/login");
      } else {
        fetchTasks();
      }
    }
  }, [session, isSessionLoading, router, fetchTasks]);

  // Show loading state while checking session
  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-soft border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">My Tasks</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-error/30 rounded-xl">
            <p className="text-sm text-error">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-2 text-sm text-error hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Task creation form */}
        <div className="mb-8 p-6 bg-surface rounded-2xl shadow-soft border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a New Task
          </h2>
          <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
        </div>

        {/* Task list */}
        <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Your Tasks
            </h2>
            {tasks.length > 0 && (
              <span className="text-sm px-3 py-1 rounded-full bg-primary-light/30 text-primary-dark">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </main>
    </div>
  );
}
