import { useState, useCallback } from 'react';
import type { Log } from '../types';
import { updateLog } from '../services/logs';
import { ApiClientError } from '../services/api';

// Editable log types (registration logs cannot be edited)
type EditableLogType = 'memo' | 'quote';

interface UseLogEditResult {
  isEditing: boolean;
  editedContent: string;
  editedLogType: EditableLogType;
  isSaving: boolean;
  error: string | null;
  startEdit: (log: Log) => void;
  cancelEdit: () => void;
  setEditedContent: (content: string) => void;
  setEditedLogType: (logType: EditableLogType) => void;
  saveEdit: () => Promise<Log | null>;
}

export function useLogEdit(
  logId: string,
  onSaveSuccess?: (updatedLog: Log) => void
): UseLogEditResult {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedLogType, setEditedLogType] = useState<EditableLogType>('memo');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = useCallback((log: Log) => {
    // Registration logs cannot be edited
    if (log.logType === 'registration') {
      return;
    }
    setEditedContent(log.content);
    setEditedLogType(log.logType);
    setIsEditing(true);
    setError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent('');
    setEditedLogType('memo');
    setError(null);
  }, []);

  const saveEdit = useCallback(async (): Promise<Log | null> => {
    if (!editedContent.trim()) {
      setError('内容を入力してください');
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedLog = await updateLog(logId, {
        content: editedContent,
        logType: editedLogType,
      });

      setIsEditing(false);
      setEditedContent('');
      setEditedLogType('memo');

      if (onSaveSuccess) {
        onSaveSuccess(updatedLog);
      }

      return updatedLog;
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status === 403) {
          setError('このログを編集する権限がありません');
        } else {
          setError(err.message);
        }
      } else {
        setError('保存に失敗しました');
      }
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [logId, editedContent, editedLogType, onSaveSuccess]);

  return {
    isEditing,
    editedContent,
    editedLogType,
    isSaving,
    error,
    startEdit,
    cancelEdit,
    setEditedContent,
    setEditedLogType,
    saveEdit,
  };
}
