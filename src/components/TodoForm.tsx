'use client';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo.type';
import { X } from 'lucide-react';
import { Form, Input, Checkbox, Button, Modal } from 'antd';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import type { TodoFormData } from '@/types/todoForm.type';
import todoSchema from '@/schema/todoSchema';

const { TextArea } = Input;

interface TodoFormProps {
  todo?: Todo;
  userId: number;
  handleCreateTodo: (todoData: CreateTodoInput) => void;
  handleUpdateTodo?: (todoData: UpdateTodoInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  userId,
  handleUpdateTodo,
  handleCreateTodo,
  onClose,
  isLoading = false,
}) => {
  const [form] = Form.useForm<TodoFormData>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      });
    }
  }, [todo, form]);

  const handleSubmit = async (values: any) => {
    try {
      setErrors({});

      const formData: TodoFormData = {
        title: values.title,
        description: values.description || '',
        completed: values.completed || false,
      };

      todoSchema.parse(formData);

      if (todo) {
        const updateData: UpdateTodoInput = {
          id: todo.id,
          title: formData.title,
          description: formData.description,
          completed: formData.completed || false,
        };
        if (handleUpdateTodo) handleUpdateTodo(updateData);
      } else {
        const createData: CreateTodoInput = {
          user_id: userId,
          title: formData.title,
          description: formData.description || '',
        };
        handleCreateTodo(createData);
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
      title={todo ? 'Edit Todo' : 'Create New Todo'}
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
          completed: false,
        }}
      >
        <Form.Item
          label='Todo Title'
          name='title'
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title}
        >
          <Input placeholder='Enter todo title' size='large' />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description}
        >
          <TextArea
            rows={4}
            placeholder='Todo description (optional)'
            size='large'
            showCount
            maxLength={500}
          />
        </Form.Item>

        {todo && (
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
              {todo ? 'Update Todo' : 'Create Todo'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
