'use client';
import { Edit, Trash2, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { Task, UpdateTaskInput } from '@/types';
import {
  getPriorityColor,
  getPriorityIcon,
  getStatusColor,
  getStatusIcon,
  formatDate,
  isOverdue,
  isDueSoon,
} from '@/utils/taskUtils';
import { StatusEnum } from '@/enums/taskStatus.enum';

interface TaskItemProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onToggleComplete: (taskId: number, completed: boolean) => void;
  onUpdateTask: (task: UpdateTaskInput) => void;
  isLoading?: boolean;
  showTodoInfo?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onUpdateTask,
  isLoading = false,
  showTodoInfo = false,
}) => {
  const isTaskOverdue = task.due_date && !task.completed && isOverdue(task.due_date);
  const isTaskDueSoon = task.due_date && !task.completed && isDueSoon(task.due_date);

  const handleToggleComplete = () => {
    const newCompleted = !task.completed;
    onToggleComplete(task.id, newCompleted);
    
    // Also update status to done if completing, or to todo if uncompleting
    onUpdateTask({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: newCompleted,
      status: newCompleted ? StatusEnum.DONE : StatusEnum.TODO,
      priority: task.priority,
      due_date: task.due_date,
    });
  };

  const handleEdit = () => {
    onEditTask(task);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  const getDueDateColor = () => {
    if (!task.due_date || task.completed) return 'text-gray-500';
    if (isTaskOverdue) return 'text-red-600 bg-red-50 border-red-200';
    if (isTaskDueSoon) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getDueDateIcon = () => {
    if (!task.due_date || task.completed) return <Calendar size={12} />;
    if (isTaskOverdue) return <AlertTriangle size={12} />;
    if (isTaskDueSoon) return <Clock size={12} />;
    return <Calendar size={12} />;
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'opacity-75 bg-gray-50' 
        : isTaskOverdue
          ? 'border-l-4 border-l-red-500'
          : isTaskDueSoon
            ? 'border-l-4 border-l-yellow-500'
            : 'border-l-4 border-l-blue-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Completion Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={`mt-1 p-1 rounded-full transition-colors flex-shrink-0 ${
              task.completed 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
            disabled={isLoading}
          >
            <CheckCircle2 
              size={18} 
              className={task.completed ? 'fill-current' : ''}
            />
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Status */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium text-sm ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h4>
              
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                <span>{getStatusIcon(task.status)}</span>
                {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>

              {/* Priority Badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                <span>{getPriorityIcon(task.priority)}</span>
                {task.priority === 1 ? 'Low' : task.priority === 2 ? 'Medium' : 'High'}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p className={`text-sm mb-2 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            {/* Due Date and Metadata */}
            <div className="flex items-center gap-4 text-xs">
              {task.due_date && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${getDueDateColor()}`}>
                  {getDueDateIcon()}
                  <span className="font-medium">
                    {isTaskOverdue ? 'Overdue: ' : isTaskDueSoon ? 'Due Soon: ' : 'Due: '}
                    {formatDate(task.due_date)}
                  </span>
                </span>
              )}
              
              <span className="text-gray-500">
                Created {formatDate(task.created_at)}
              </span>
              
              {task.updated_at !== task.created_at && (
                <span className="text-gray-500">
                  Updated {formatDate(task.updated_at)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Task"
              disabled={isLoading}
            >
              <Edit size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Task"
              disabled={isLoading}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
