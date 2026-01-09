// Task ID: T043, T047, T053-T055, T059-T061, T065-T067 - TaskItem with full CRUD
"use client";

import { useState, FormEvent } from "react";
import { Task, TaskUpdate } from "@/types";

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onToggleComplete: (taskId: number, isCompleted: boolean) => Promise<void>;
}

/**
 * Individual task item display component with CRUD functionality.
 *
 * Task ID: T043 - Create TaskItem component
 * Task ID: T047 - Style completed vs incomplete tasks differently
 * Task ID: T053 - Add edit mode to TaskItem component
 * Task ID: T054 - Implement inline editing UI in TaskItem component
 * Task ID: T055 - Call PATCH endpoint on save in TaskItem component
 * Task ID: T059 - Add delete button to TaskItem component
 * Task ID: T060 - Call DELETE endpoint on click in TaskItem component
 * Task ID: T061 - Remove task from UI immediately after successful delete
 * Task ID: T065 - Add completion toggle checkbox to TaskItem
 * Task ID: T066 - Call complete/incomplete endpoint on toggle
 * Task ID: T067 - Update UI immediately on toggle success
 */
export function TaskItem({
  task,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  // T053: Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Format date for display.
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * T054, T055: Handle save edit.
   */
  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate title
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }
    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    setIsLoading(true);

    try {
      // T055: Call PATCH endpoint
      await onUpdate(task.id, {
        title: trimmedTitle,
        description: editDescription.trim() || null,
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update task");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel edit and reset form.
   */
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setError(null);
    setIsEditing(false);
  };

  /**
   * T060: Handle delete.
   */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task? This cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // T060: Call DELETE endpoint
      await onDelete(task.id);
      // T061: UI update handled by parent component
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete task");
      }
      setIsLoading(false);
    }
  };

  /**
   * T066: Handle toggle completion.
   */
  const handleToggleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // T066: Call complete/incomplete endpoint
      await onToggleComplete(task.id, !task.is_completed);
      // T067: UI update handled by parent component
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update task");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // T054: Edit mode UI
  if (isEditing) {
    return (
      <div className="p-4 border-2 border-primary/30 rounded-xl bg-primary-light/10">
        <form onSubmit={handleSaveEdit} className="space-y-3">
          {error && (
            <div className="p-2 bg-red-50 border border-error/30 rounded-lg text-sm text-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor={`edit-title-${task.id}`} className="sr-only">
              Title
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={200}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Task title"
            />
            <p className="mt-1 text-xs text-muted">
              {editTitle.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor={`edit-desc-${task.id}`} className="sr-only">
              Description
            </label>
            <textarea
              id={`edit-desc-${task.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isLoading}
              rows={2}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-all"
              placeholder="Description (optional)"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !editTitle.trim()}
              className="px-4 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg disabled:bg-primary-light transition-colors"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Normal display mode
  return (
    <div
      className={`p-4 border rounded-xl transition-all ${
        task.is_completed
          ? "bg-surface-alt border-border"
          : "bg-surface border-border hover:border-primary/50 hover:shadow-soft"
      }`}
    >
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-error/30 rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* T065: Completion toggle checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`mt-1 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            task.is_completed
              ? "bg-success border-success text-white"
              : "border-border hover:border-primary hover:bg-primary/10"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.is_completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-grow min-w-0">
          {/* Title with strikethrough for completed tasks */}
          <h3
            className={`font-medium ${
              task.is_completed ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {task.title}
          </h3>

          {/* Optional description */}
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.is_completed ? "text-muted/70" : "text-muted"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <p className="mt-2 text-xs text-muted/60">
            Created {formatDate(task.created_at)}
            {task.is_completed && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-medium">
                Completed
              </span>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 flex-shrink-0">
          {/* T053: Edit button */}
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* T059: Delete button */}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
