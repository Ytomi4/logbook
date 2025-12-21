import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection, FeatureSection } from '../components/Landing';
import { Layout } from '../components/common/Layout';

const meta = {
  title: 'Pages/LandingPage',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unauthenticated: Story = {
  render: () => (
    <Layout>
      <HeroSection isAuthenticated={false} />
      <FeatureSection />
    </Layout>
  ),
};

export const Authenticated: Story = {
  render: () => (
    <Layout>
      <HeroSection isAuthenticated={true} username="testuser" />
      <FeatureSection />
    </Layout>
  ),
};
