import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, ErrorBoundary, ToastProvider } from './components/common';
import { TimelinePage } from './pages/TimelinePage';
import { BookListPage } from './pages/BookListPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookRegistrationPage } from './pages/BookRegistrationPage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppRoutes() {
  useKeyboardShortcuts();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/books" element={<BookListPage />} />
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
