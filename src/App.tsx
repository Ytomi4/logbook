import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ErrorBoundary, ToastProvider } from './components/common';
import { HomePage } from './pages/HomePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookRegistrationPage } from './pages/BookRegistrationPage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppRoutes() {
  useKeyboardShortcuts();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<Navigate to="/" replace />} />
        <Route path="/books/new" element={<BookRegistrationPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
      </Routes>
    </Layout>
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
