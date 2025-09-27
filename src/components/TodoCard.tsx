'use client';
import { Edit, Trash2, ChevronDown, ChevronUp, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Todo, Task } from '@/types';
import { calculateTodoProgress, formatDateTime } from '@/utils/taskUtils';

interface TodoCardProps {
  todo: Todo;
  tasks: Task[];
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onToggleTodoComplete: (todoId: number, completed: boolean) => void;
  onAddTask: (todoId: number) => void;
  onViewTodo: (todoId: number) => void;
  isLoading?: boolean;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  tasks,
  onEditTodo,
  onDeleteTodo,
  onToggleTodoComplete,
  onAddTask,
  onViewTodo,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = calculateTodoProgress(tasks);
  const hasOverdueTasks = tasks.some(task => 
    task.due_date && 
    !task.completed && 
    new Date(task.due_date) < new Date()
  );

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTodoComplete(todo.id, !todo.completed);
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddTask(todo.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTodo(todo);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this todo? This will also delete all associated tasks.')) {
      onDeleteTodo(todo.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border-l-4 transition-all duration-200 hover:shadow-lg cursor-pointer ${
        todo.completed 
          ? 'border-l-green-500 opacity-75' 
          : hasOverdueTasks 
            ? 'border-l-red-500' 
            : 'border-l-blue-500'
      }`}
      onClick={() => onViewTodo(todo.id)}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Completion Checkbox */}
            <button
              onClick={handleToggleComplete}
              className={`mt-1 p-1 rounded-full transition-colors ${
                todo.completed 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
              disabled={isLoading}
            >
              <CheckCircle2 
                size={20} 
                className={todo.completed ? 'fill-current' : ''}
              />
            </button>

            {/* Todo Content */}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-1 ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-sm mb-2 ${
                  todo.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Created {formatDateTime(todo.created_at)}
                </span>
                {todo.updated_at !== todo.created_at && (
                  <span>
                    Updated {formatDateTime(todo.updated_at)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleAddTask}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Add Task"
              disabled={isLoading}
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleEdit}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Todo"
              disabled={isLoading}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Todo"
              disabled={isLoading}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title={isExpanded ? 'Collapse Tasks' : 'Expand Tasks'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Progress Bar and Stats */}
        <div className="space-y-2">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.percentage)}`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className={`font-medium ${
                progress.percentage === 100 
                  ? 'text-green-600' 
                  : 'text-gray-700'
              }`}>
                {progress.completed}/{progress.total} tasks completed
              </span>
              
              {progress.percentage > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  progress.percentage === 100
                    ? 'bg-green-100 text-green-700'
                    : progress.percentage >= 70
                      ? 'bg-blue-100 text-blue-700'
                      : progress.percentage >= 40
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                }`}>
                  {progress.percentage}%
                </span>
              )}
            </div>

            {hasOverdueTasks && !todo.completed && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                Has overdue tasks
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Tasks Preview */}
      {isExpanded && tasks.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-2 text-sm ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  task.completed 
                    ? 'bg-green-400'
                    : task.status === 'in-progress'
                      ? 'bg-purple-400'
                      : 'bg-blue-400'
                }`} />
                <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                  {task.title}
                </span>
                {task.due_date && !task.completed && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    new Date(task.due_date) < new Date()
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Due {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
            
            {tasks.length > 3 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{tasks.length - 3} more tasks
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewTodo(todo.id);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all tasks →
            </button>
          </div>
        </div>
      )}

      {/* Empty State for Expanded View */}
      {isExpanded && tasks.length === 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">No tasks yet</p>
            <button
              onClick={handleAddTask}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus size={14} />
              Add your first task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
