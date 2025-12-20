import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AvatarUploader } from './AvatarUploader';

const meta = {
  title: 'Common/AvatarUploader',
  component: AvatarUploader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onUpload: fn(),
  },
} satisfies Meta<typeof AvatarUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentImageUrl: null,
  },
};

export const WithCurrentImage: Story = {
  args: {
    currentImageUrl: 'https://placehold.co/128x128/e2e8f0/64748b?text=User',
  },
};

export const Uploading: Story = {
  args: {
    currentImageUrl: null,
    onUpload: fn(async () => {
      // Simulate slow upload
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }),
  },
};

export const WithLargeImage: Story = {
  args: {
    currentImageUrl: 'https://placehold.co/256x256/e2e8f0/64748b?text=Large',
  },
};
