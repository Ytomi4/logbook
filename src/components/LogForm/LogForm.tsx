import { useState } from 'react';
import type { CreateLogRequest } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '../common';

interface LogFormProps {
  initialContent?: string;
  onSubmit: (data: CreateLogRequest) => Promise<void> | Promise<unknown>;
  onCancel?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function LogForm({
  initialContent = '',
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
}: LogFormProps) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
      await onSubmit({ logType: 'note', content: content.trim() });
      if (!isEditing) {
        setContent('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="読書メモを入力... (引用は⌘⇧Qでマーク)"
        disabled={isLoading}
        onSubmit={handleSubmit}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

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
