import { useEffect } from 'react';
import { useRichTextEditor } from '../../hooks/useRichTextEditor';
import { QuoteButton } from './QuoteButton';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: () => void;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '読書メモを入力……',
  disabled = false,
  onSubmit,
}: RichTextEditorProps) {
  const { editorRef, content, toggleQuote, handleKeyDown, syncFromDOM } =
    useRichTextEditor({
      initialValue: value,
      onChange,
    });

  // Sync external value changes to editor (e.g., form reset after submit)
  useEffect(() => {
    if (editorRef.current && value !== content) {
      // Clear the editor if value is empty (form reset)
      if (value === '') {
        editorRef.current.innerHTML = '';
      }
    }
  }, [value, content, editorRef]);

  // Handle input event to sync DOM to state
  const handleInput = () => {
    syncFromDOM();
  };

  // Handle paste to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Handle Ctrl+Enter for submit
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e);

    // Ctrl/Cmd + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Editor area - borderless design */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleEditorKeyDown}
        onPaste={handlePaste}
        className={`
          min-h-[120px] p-3 outline-none
          text-gray-900 whitespace-pre-wrap
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-gray-400 empty:before:pointer-events-none
          [&>div[data-quote='true']]:border-l-4
          [&>div[data-quote='true']]:border-gray-200
          [&>div[data-quote='true']]:pl-4
          [&>div[data-quote='true']]:italic
          [&>div[data-quote='true']]:text-gray-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-label="読書メモ"
        aria-disabled={disabled}
      />

      {/* Footer with quote button */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-gray-100">
        <QuoteButton onClick={toggleQuote} disabled={disabled} />
        <div className="text-xs text-gray-400">
          {content.length > 0 && `${content.length}文字`}
        </div>
      </div>
    </div>
  );
}
