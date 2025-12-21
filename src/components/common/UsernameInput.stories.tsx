import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UsernameInput } from './UsernameInput';

const meta = {
  title: 'Common/UsernameInput',
  component: UsernameInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UsernameInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for controlled input
function UsernameInputWrapper(props: {
  initialValue?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(props.initialValue || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  return (
    <div className="space-y-2">
      <UsernameInput
        value={value}
        onChange={setValue}
        onValidationChange={setIsValid}
        disabled={props.disabled}
      />
      <p className="text-sm text-gray-500">
        Validation status: {isValid === null ? 'checking...' : isValid ? 'valid' : 'invalid'}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <UsernameInputWrapper />,
};

export const WithInitialValue: Story = {
  render: () => <UsernameInputWrapper initialValue="testuser" />,
};

export const Disabled: Story = {
  render: () => <UsernameInputWrapper initialValue="testuser" disabled />,
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: () => {},
    onValidationChange: () => {},
  },
};

export const WithValidUsername: Story = {
  args: {
    value: 'valid_username',
    onChange: () => {},
    onValidationChange: () => {},
  },
};

export const WithInvalidUsername: Story = {
  args: {
    value: 'a',
    onChange: () => {},
    onValidationChange: () => {},
  },
};
