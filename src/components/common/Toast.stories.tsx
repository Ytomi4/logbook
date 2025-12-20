import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from './Button';

// Toast demo component
function ToastDemo({ type, message }: { type: 'success' | 'error' | 'info' | 'warning'; message: string }) {
  const { addToast } = useToast();

  return (
    <Button onClick={() => addToast(type, message)}>
      Show {type} toast
    </Button>
  );
}

const meta = {
  title: 'Common/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <ToastDemo type="success" message="Operation completed successfully!" />
  ),
};

export const Error: Story = {
  render: () => (
    <ToastDemo type="error" message="Something went wrong. Please try again." />
  ),
};

export const Info: Story = {
  render: () => (
    <ToastDemo type="info" message="Here is some useful information." />
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastDemo type="warning" message="Please be careful with this action." />
  ),
};

// All types demo
function AllToastsDemo() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" onClick={() => addToast('success', 'Success message!')}>
        Success
      </Button>
      <Button variant="danger" onClick={() => addToast('error', 'Error message!')}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => addToast('info', 'Info message!')}>
        Info
      </Button>
      <Button variant="ghost" onClick={() => addToast('warning', 'Warning message!')}>
        Warning
      </Button>
    </div>
  );
}

export const AllTypes: Story = {
  render: () => <AllToastsDemo />,
};
