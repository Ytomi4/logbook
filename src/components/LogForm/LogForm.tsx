import { useState } from 'react';
import type { LogType, CreateLogRequest } from '../../types';
import { LogTypeSelector } from './LogTypeSelector';
import { Button, Textarea } from '../common';

interface LogFormProps {
  initialLogType?: LogType;
  initialContent?: string;
  onSubmit: (data: CreateLogRequest) => Promise<void> | Promise<unknown>;
  onCancel?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function LogForm({
  initialLogType = 'memo',
  initialContent = '',
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
}: LogFormProps) {
  const [logType, setLogType] = useState<LogType>(initialLogType);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('内容を入力してください');
      return;
    }

    if (content.length > 10000) {
      setError('内容は10000文字以内で入力してください');
      return;
    }

    try {
      await onSubmit({ logType, content: content.trim() });
      if (!isEditing) {
        setContent('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LogTypeSelector
        value={logType}
        onChange={setLogType}
        disabled={isLoading}
      />

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          logType === 'quote'
            ? '本からの引用を入力...'
            : '読書中に気づいたこと、感想など...'
        }
        rows={4}
        disabled={isLoading}
        error={error ?? undefined}
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
        )}
        <Button type="submit" loading={isLoading} disabled={!content.trim()}>
          {isEditing ? '更新' : '保存'}
        </Button>
      </div>
    </form>
  );
}
