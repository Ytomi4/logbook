import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common';
import { TimelinePage } from './pages/TimelinePage';
import { BookListPage } from './pages/BookListPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/new" element={<div>Add Book Page (TODO)</div>} />
          <Route path="/books/:id" element={<div>Book Detail Page (TODO)</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
