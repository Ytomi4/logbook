import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from './Loading';

const meta = {
  title: 'Common/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    text: { control: 'text' },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithText: Story = {
  args: {
    size: 'md',
    text: 'Loading data...',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="text-center">
        <Loading size="sm" />
        <p className="mt-2 text-sm text-gray-500">Small</p>
      </div>
      <div className="text-center">
        <Loading size="md" />
        <p className="mt-2 text-sm text-gray-500">Medium</p>
      </div>
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-2 text-sm text-gray-500">Large</p>
      </div>
    </div>
  ),
};
