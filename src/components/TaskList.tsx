// Task ID: T044, T046, T071 - TaskList component with loading states
"use client";

import { Task, TaskUpdate } from "@/types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onToggleComplete: (taskId: number, isCompleted: boolean) => Promise<void>;
}

/**
 * Task list display component.
 *
 * Task ID: T044 - Create TaskList component
 * Task ID: T046 - Add empty state message when no tasks
 * Task ID: T071 - Add loading states to TaskList component
 *
 * Per User Story 4: Display all tasks owned by the user
 * Per FR-012: Tasks displayed in chronological order (newest first)
 */
export function TaskList({
  tasks,
  isLoading = false,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TaskListProps) {
  // T071: Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-border rounded-xl animate-pulse bg-surface"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-primary-light/30" />
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-primary-light/20 rounded-lg w-3/4" />
                <div className="h-3 bg-surface-alt rounded-lg w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // T046: Empty state when no tasks
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 mb-4 rounded-2xl bg-primary-light/20 flex items-center justify-center">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-10 h-10 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
        <p className="mt-1 text-sm text-muted">
          Get started by creating your first task above.
        </p>
      </div>
    );
  }

  // Task list
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
