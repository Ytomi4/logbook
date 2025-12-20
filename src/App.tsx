import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ErrorBoundary, ToastProvider, RequireUsername } from './components/common';
import { HomePage } from './pages/HomePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookRegistrationPage } from './pages/BookRegistrationPage';
import { EnterPage } from './pages/EnterPage';
import { SetupPage } from './pages/SetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicTimelinePage } from './pages/PublicTimelinePage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppRoutes() {
  useKeyboardShortcuts();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/enter" element={<EnterPage />} />
      <Route path="/setup" element={<SetupPage />} />

      {/* Protected routes (require username) */}
      <Route
        path="/"
        element={
          <Layout>
            <RequireUsername>
              <HomePage />
            </RequireUsername>
          </Layout>
        }
      />
      <Route path="/books" element={<Navigate to="/" replace />} />
      <Route
        path="/books/new"
        element={
          <Layout>
            <RequireUsername>
              <BookRegistrationPage />
            </RequireUsername>
          </Layout>
        }
      />
      <Route
        path="/books/:id"
        element={
          <Layout>
            <RequireUsername>
              <BookDetailPage />
            </RequireUsername>
          </Layout>
        }
      />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Public timeline - must be last to avoid catching other routes */}
      <Route path="/:username" element={<PublicTimelinePage />} />
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
