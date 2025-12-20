import type { Meta, StoryObj } from '@storybook/react';
import { LoginButton } from './LoginButton';

const meta = {
  title: 'Common/LoginButton',
  component: LoginButton,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
