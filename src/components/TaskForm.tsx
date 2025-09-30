'use client';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import { X } from 'lucide-react';
import { Form, Input, Select, DatePicker, Checkbox, Button, Modal } from 'antd';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import type { TaskFormData } from '@/types/taskForm';
import taskSchema from '@/scheme/taskSchema';
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

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date
          ? (dayjs(task.due_date).toISOString() as string)
          : undefined,
        completed: task.completed,
      });
    }
  }, [task, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData: TaskFormData = {
        title: values.title,
        description: values.description || '',
        status: values.status,
        priority: values.priority,
        due_date: values.due_date
          ? dayjs(values.due_date).format('YYYY-MM-DD')
          : undefined,
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
        const formErrors = error.issues.map((issue) => ({
          name: issue.path as (string | number)[],
          errors: [issue.message],
        }));

        form.setFields(formErrors);

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
          rules={[
            { required: true, message: 'Please enter a task title' },
            { whitespace: true, message: 'Title cannot be empty' },
          ]}
        >
          <Input placeholder='Enter task title' size='large' />
        </Form.Item>

        <Form.Item label='Description' name='description'>
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
          <Form.Item label='Status' name='status'>
            <Select size='large'>
              <Select.Option value={StatusEnum.TODO}>📝 To Do</Select.Option>
              <Select.Option value={StatusEnum.IN_PROGRESS}>
                ⏳ In Progress
              </Select.Option>
              <Select.Option value={StatusEnum.DONE}>✅ Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Priority' name='priority'>
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

        <Form.Item label='Due Date' name='due_date'>
          <DatePicker
            style={{ width: '100%' }}
            size='large'
            format='YYYY-MM-DD'
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
