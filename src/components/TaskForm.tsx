// Task ID: T037, T038 - TaskForm component with client-side validation
"use client";

import { useState, FormEvent } from "react";
import { TaskCreate } from "@/types";

interface TaskFormProps {
  onSubmit: (data: TaskCreate) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Task creation form component.
 *
 * Task ID: T037 - Create TaskForm component
 * Task ID: T038 - Add client-side title validation
 *
 * Per FR-010: Title required (1-200 chars), description optional
 * Per User Story 3: User can create a new task
 */
export function TaskForm({ onSubmit, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  /**
   * T038: Client-side title validation.
   * Per FR-010: Title must be 1-200 characters.
   */
  const validateTitle = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Title is required";
    }
    if (trimmed.length > 200) {
      return "Title must be 200 characters or less";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate title
    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
      });

      // Clear form on success
      setTitle("");
      setDescription("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create task");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-error/30 rounded-xl">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground"
        >
          Title <span className="text-error">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2.5 border border-border rounded-xl shadow-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-surface-alt disabled:cursor-not-allowed transition-all"
        />
        <p className="mt-1 text-xs text-muted">
          {title.length}/200 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          Description <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2.5 border border-border rounded-xl shadow-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-surface-alt disabled:cursor-not-allowed resize-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-soft disabled:bg-primary-light disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </>
        )}
      </button>
    </form>
  );
}
