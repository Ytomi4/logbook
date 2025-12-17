import { useState } from 'react';
import type { Book, CreateLogRequest } from '../../types';
import { Modal } from '../common/Modal';
import { LogForm } from './LogForm';
import { createLog } from '../../services/logs';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onSuccess?: () => void;
}

export function QuickLogModal({
  isOpen,
  onClose,
  book,
  onSuccess,
}: QuickLogModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateLogRequest) => {
    setIsLoading(true);
    try {
      await createLog(book.id, data);
      onSuccess?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`ログを追加 - ${book.title}`}>
      <LogForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
