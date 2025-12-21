import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LogTypeSelector } from './LogTypeSelector';
import type { LogType } from '../../types';

const meta = {
  title: 'LogForm/LogTypeSelector',
  component: LogTypeSelector,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['memo', 'quote'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof LogTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Memo: Story = {
  args: {
    value: 'memo',
    onChange: () => {},
  },
};

export const Quote: Story = {
  args: {
    value: 'quote',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: 'memo',
    onChange: () => {},
    disabled: true,
  },
};

// Interactive story
const InteractiveSelector = () => {
  const [value, setValue] = useState<LogType>('memo');

  return (
    <div className="max-w-sm">
      <LogTypeSelector value={value} onChange={setValue} />
      <p className="mt-4 text-sm text-gray-600">
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSelector />,
};
