import { useRef, useState, useCallback, useEffect, RefObject } from 'react';

export interface UseRichTextEditorOptions {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export interface UseRichTextEditorReturn {
  editorRef: RefObject<HTMLDivElement | null>;
  content: string;
  setContent: (value: string) => void;
  toggleQuote: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  syncFromDOM: () => void;
  syncToDOM: () => void;
}

// Convert Markdown text to HTML for contentEditable
function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  return lines
    .map((line) => {
      const isQuote = line.startsWith('> ');
      const content = isQuote ? line.slice(2) : line;
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (isQuote) {
        return `<div data-quote="true">${escapedContent || '<br>'}</div>`;
      }
      return `<div>${escapedContent || '<br>'}</div>`;
    })
    .join('');
}

// Convert HTML from contentEditable to Markdown text
function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const lines: string[] = [];

  // Handle direct text nodes (no divs)
  const firstChild = tempDiv.childNodes[0];
  if (tempDiv.childNodes.length === 1 && firstChild?.nodeType === Node.TEXT_NODE) {
    return tempDiv.textContent || '';
  }

  // Handle empty editor
  if (!tempDiv.innerHTML || tempDiv.innerHTML === '<br>') {
    return '';
  }

  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        lines.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const isQuote = element.getAttribute('data-quote') === 'true';
      const text = element.textContent || '';

      if (isQuote) {
        lines.push(`> ${text}`);
      } else {
        lines.push(text);
      }
    }
  });

  return lines.join('\n');
}

// Get the current paragraph element at cursor position
function getCurrentParagraph(editor: HTMLDivElement): HTMLDivElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  let node: Node | null = selection.anchorNode;

  while (node && node !== editor) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'DIV') {
      return node as HTMLDivElement;
    }
    node = node.parentNode;
  }

  return null;
}

// Normalize editor: wrap text nodes in <div> elements
function normalizeEditor(editor: HTMLDivElement): void {
  const nodesToReplace: { textNode: Text; content: string }[] = [];

  // Collect text nodes that need to be wrapped (avoid modifying while iterating)
  editor.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const content = node.textContent || '';
      if (content.trim() || content.includes('\n')) {
        nodesToReplace.push({ textNode: node as Text, content });
      }
    }
  });

  // Replace text nodes with div elements
  for (const { textNode, content } of nodesToReplace) {
    const div = document.createElement('div');
    div.textContent = content;
    editor.replaceChild(div, textNode);
  }
}

// Get all paragraphs in selection range
function getSelectedParagraphs(editor: HTMLDivElement): HTMLDivElement[] {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return [];

  const range = selection.getRangeAt(0);
  const paragraphs: HTMLDivElement[] = [];

  // If collapsed (no selection), return current paragraph
  if (range.collapsed) {
    const current = getCurrentParagraph(editor);
    return current ? [current] : [];
  }

  // Get all divs within editor
  const allDivs = Array.from(editor.querySelectorAll('div'));

  for (const div of allDivs) {
    if (range.intersectsNode(div)) {
      paragraphs.push(div);
    }
  }

  return paragraphs;
}

export function useRichTextEditor(
  options: UseRichTextEditorOptions = {}
): UseRichTextEditorReturn {
  const { initialValue = '', onChange } = options;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [content, setContentState] = useState(initialValue);
  const isInternalUpdate = useRef(false);

  // Set content and notify onChange
  const setContent = useCallback(
    (value: string) => {
      setContentState(value);
      onChange?.(value);
    },
    [onChange]
  );

  // Sync content from DOM to state
  const syncFromDOM = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const markdown = htmlToMarkdown(html);
    if (markdown !== content) {
      setContent(markdown);
    }
  }, [content, setContent]);

  // Sync content from state to DOM
  const syncToDOM = useCallback(() => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;

    // Save cursor position
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const cursorOffset = range?.startOffset || 0;

    editorRef.current.innerHTML = markdownToHtml(content);

    // Restore cursor position (best effort)
    if (selection && editorRef.current.childNodes.length > 0) {
      const newRange = document.createRange();
      const lastChild = editorRef.current.lastChild;
      if (lastChild) {
        try {
          const textNode = lastChild.firstChild || lastChild;
          const offset = Math.min(
            cursorOffset,
            textNode.textContent?.length || 0
          );
          newRange.setStart(textNode, offset);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch {
          // Ignore cursor restoration errors
        }
      }
    }

    isInternalUpdate.current = false;
  }, [content]);

  // Toggle quote for current paragraph(s)
  const toggleQuote = useCallback(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Normalize: wrap any text nodes in <div> elements before processing
    normalizeEditor(editor);

    const paragraphs = getSelectedParagraphs(editor);

    // If no paragraphs (empty editor), create a quote paragraph
    if (paragraphs.length === 0) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('data-quote', 'true');
      newDiv.innerHTML = '<br>';
      editor.appendChild(newDiv);

      // Set cursor in the new div
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.setStart(newDiv, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      syncFromDOM();
      return;
    }

    // Check if all selected paragraphs are quotes
    const allQuotes = paragraphs.every(
      (p) => p.getAttribute('data-quote') === 'true'
    );

    // Toggle: if all are quotes, remove quote; otherwise, make all quotes
    for (const paragraph of paragraphs) {
      if (allQuotes) {
        paragraph.removeAttribute('data-quote');
      } else {
        paragraph.setAttribute('data-quote', 'true');
      }
    }

    syncFromDOM();
  }, [syncFromDOM]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cmd/Ctrl + Shift + Q for quote toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        toggleQuote();
      }
    },
    [toggleQuote]
  );

  // Sync initial value to DOM
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = markdownToHtml(initialValue);
    }
  }, []);

  return {
    editorRef,
    content,
    setContent,
    toggleQuote,
    handleKeyDown,
    syncFromDOM,
    syncToDOM,
  };
}
