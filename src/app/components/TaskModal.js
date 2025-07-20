import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Button, Form, ConfigProvider } from 'antd'; // 1. Import ConfigProvider
import dayjs from 'dayjs';

export default function TaskModal({ isModalOpen, setIsModalOpen, editTask, onSave }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      form.setFieldsValue({
        title: editTask.title || '',
        description: editTask.description || '',
        date: editTask.date ? dayjs(editTask.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editTask, form]);


  const handleSave = async (values) => {
    setLoading(true);
    try {
      await onSave({
        title: values.title,
        description: values.description,
        date: values.date ? values.date.toISOString() : null,
      });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const modalTitle = editTask ? 'Edit Task' : 'Add New Task';

  return (
    // 2. Wrap the Modal in a ConfigProvider to apply our theme overrides
    <ConfigProvider
      theme={{
        token: {
          // Sets the color for icons inside the modal, like the 'X' close button
          colorIcon: 'hsl(var(--muted-foreground))',
          colorIconHover: 'hsl(var(--foreground))',
        },
      }}
    >
      <Modal
        title={<span className="font-bold text-foreground">{modalTitle}</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancel} className="hover:!border-border hover:!text-foreground">
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            className="!bg-primary hover:!bg-primary/90"
            loading={loading}
          >
            Save Task
          </Button>,
        ]}
        classNames={{
          mask: 'bg-black/70 backdrop-blur-sm',
          // 3. Add padding to the header for better title spacing
          header: '!bg-card !text-foreground !border-b !border-border !p-6',
          body: '!bg-card !text-foreground',
          content: '!bg-card !p-0',
          footer: '!bg-card !border-t !border-border !pt-4 !pr-6 !pb-4',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="p-6 pt-0" // Remove top padding to respect header padding
        >
          <Form.Item
            name="title"
            label={<span className="text-sm font-medium text-muted-foreground">Title</span>}
            rules={[{ required: true, message: 'Title is required.' }]}
          >
            <Input
              placeholder="e.g., Finish project report"
              className="!bg-muted !text-foreground !border-border focus:!border-primary focus:!shadow-none placeholder:!text-muted-foreground"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-sm font-medium text-muted-foreground">Description</span>}
          >
            <Input.TextArea
              rows={4}
              placeholder="Add more details about the task..."
              className="!bg-muted !text-foreground !border-border focus:!border-primary focus:!shadow-none placeholder:!text-muted-foreground"
            />
          </Form.Item>

          <Form.Item
            name="date"
            label={<span className="text-sm font-medium text-muted-foreground">Due Date</span>}
          >
            {/* 4. Use ConfigProvider again specifically for the DatePicker placeholder */}
            <ConfigProvider theme={{ token: { colorTextPlaceholder: 'hsl(var(--foreground))' } }}>
              <DatePicker
                placeholder="Select date"
                className="!w-full !bg-muted !border-border"
                inputReadOnly={true}
                style={{ color: 'hsl(var(--foreground))' }}
              />
            </ConfigProvider>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}