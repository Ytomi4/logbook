import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ErrorBoundary, ToastProvider } from './components/common';
import { LandingPage } from './pages/LandingPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookRegistrationPage } from './pages/BookRegistrationPage';
import { EnterPage } from './pages/EnterPage';
import { SetupPage } from './pages/SetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { TimelinePage } from './pages/TimelinePage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppRoutes() {
  useKeyboardShortcuts();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/enter" element={<EnterPage />} />
      <Route path="/setup" element={<SetupPage />} />

      {/* Main routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/books" element={<Navigate to="/" replace />} />
      <Route
        path="/books/new"
        element={
          <Layout>
            <BookRegistrationPage />
          </Layout>
        }
      />
      <Route
        path="/books/:id"
        element={
          <Layout>
            <BookDetailPage />
          </Layout>
        }
      />
      <Route path="/settings" element={<SettingsPage />} />

      {/* User timeline - must be last to avoid catching other routes */}
      <Route path="/:username" element={<TimelinePage />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
