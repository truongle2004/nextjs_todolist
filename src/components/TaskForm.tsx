'use client';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import { X } from 'lucide-react';
import { Form, Input, Select, Checkbox, Button, Modal } from 'antd';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import type { TaskFormData } from '@/types/taskForm';
import taskSchema from '@/schema/taskSchema';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task.type';

const { TextArea } = Input;

interface TaskFormProps {
  task?: Task;
  todoId: number;
  handleCreateTask: (taskData: CreateTaskInput) => void;
  handleUpdateTask?: (taskData: UpdateTaskInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  todoId,
  handleUpdateTask,
  handleCreateTask,
  onClose,
  isLoading = false,
}) => {
  const [form] = Form.useForm<TaskFormData>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        completed: task.completed,
      });
      if (task.due_date) {
        setDueDate(task.due_date.split('T')[0]);
      }
    }
  }, [task, form]);

  const handleSubmit = async (values: any) => {
    try {
      setErrors({});

      const formData: TaskFormData = {
        title: values.title,
        description: values.description || '',
        status: values.status,
        priority: values.priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        completed: values.completed || false,
      };

      taskSchema.parse(formData);

      if (task) {
        const updateData: UpdateTaskInput = {
          id: task.id,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date,
          completed: formData.completed || false,
        };
        if (handleUpdateTask) handleUpdateTask(updateData);
      } else {
        const createData: CreateTaskInput = {
          todo_id: todoId,
          title: formData.title,
          description: formData.description || '',
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date,
        };
        handleCreateTask(createData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          newErrors[fieldName] = issue.message;
        });
        setErrors(newErrors);

        console.error('Validation errors:', error.issues);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create New Task'}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<X size={20} />}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          status: StatusEnum.TODO,
          priority: TaskPriorityEnum.MEDIUM,
          completed: false,
        }}
      >
        <Form.Item
          label='Task Title'
          name='title'
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title}
        >
          <Input placeholder='Enter task title' size='large' />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description}
        >
          <TextArea
            rows={3}
            placeholder='Task description (optional)'
            size='large'
          />
        </Form.Item>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <Form.Item
            label='Status'
            name='status'
            validateStatus={errors.status ? 'error' : ''}
            help={errors.status}
          >
            <Select size='large'>
              <Select.Option value={StatusEnum.TODO}>📝 To Do</Select.Option>
              <Select.Option value={StatusEnum.IN_PROGRESS}>
                ⏳ In Progress
              </Select.Option>
              <Select.Option value={StatusEnum.DONE}>✅ Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Priority'
            name='priority'
            validateStatus={errors.priority ? 'error' : ''}
            help={errors.priority}
          >
            <Select size='large'>
              <Select.Option value={TaskPriorityEnum.LOW}>
                🟢 Low Priority
              </Select.Option>
              <Select.Option value={TaskPriorityEnum.MEDIUM}>
                🟡 Medium Priority
              </Select.Option>
              <Select.Option value={TaskPriorityEnum.HIGH}>
                🔴 High Priority
              </Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label='Due Date'
          validateStatus={errors.due_date ? 'error' : ''}
          help={errors.due_date}
        >
          <input
            type='date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 11px',
              fontSize: '16px',
              lineHeight: '1.5715',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4096ff';
              e.target.style.boxShadow = '0 0 0 2px rgba(5, 145, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d9d9d9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </Form.Item>

        {task && (
          <Form.Item name='completed' valuePropName='checked'>
            <Checkbox>Mark as completed</Checkbox>
          </Form.Item>
        )}

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
