import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    children: 'This is the modal content.',
    onClose: () => {},
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: 'Modal without a title header.',
    onClose: () => {},
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: 'Add New Entry',
    onClose: () => {},
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Enter content"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
    ),
  },
};

// Interactive story with state
const InteractiveModalStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Modal">
        <p>Click outside or press Escape to close this modal.</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModalStory />,
};
