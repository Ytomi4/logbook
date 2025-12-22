import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

const meta = {
  title: 'LogForm/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl p-4">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Controlled component wrapper for interactive stories
function ControlledRichTextEditor(props: React.ComponentProps<typeof RichTextEditor>) {
  const [value, setValue] = useState(props.value || '');
  return (
    <RichTextEditor
      {...props}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        props.onChange?.(newValue);
      }}
    />
  );
}

export const Empty: Story = {
  args: {
    value: '',
    placeholder: '読書メモを入力...',
  },
};

export const WithContent: Story = {
  args: {
    value: 'This is a sample note about the book.',
  },
};

export const WithQuote: Story = {
  args: {
    value: '> The only way to do great work is to love what you do.',
  },
};

export const MixedContent: Story = {
  args: {
    value: '> The only way to do great work is to love what you do.\nThis quote really resonates with me.\n> Another inspiring quote here.\nAnd some more thoughts.',
  },
};

export const Interactive: Story = {
  render: (args) => <ControlledRichTextEditor {...args} />,
  args: {
    value: '',
    placeholder: 'Type here and try the quote button...',
  },
};

export const Disabled: Story = {
  args: {
    value: 'This content cannot be edited.',
    disabled: true,
  },
};
