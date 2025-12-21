import { Layout } from '../components/common/Layout';
import { HeroSection, FeatureSection } from '../components/Landing';
import { useAuth } from '../hooks/useAuth';

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      <HeroSection
        isAuthenticated={isAuthenticated}
        username={user?.username}
      />
      <FeatureSection />
    </Layout>
  );
}
