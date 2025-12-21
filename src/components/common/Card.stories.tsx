import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

const meta = {
  title: 'Common/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a simple card with default padding.',
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: 'Card with small padding.',
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: 'Card with large padding.',
  },
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: 'Card with no padding.',
  },
};

export const WithHeaderAndContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the card content area. You can put any content here.</p>
      </CardContent>
    </Card>
  ),
};

export const ComplexCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Book Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-gray-600">Author: Sample Author</p>
          <p className="text-gray-600">Publisher: Sample Publisher</p>
          <p className="text-gray-600">ISBN: 978-4-00-000000-0</p>
        </div>
      </CardContent>
    </Card>
  ),
};
