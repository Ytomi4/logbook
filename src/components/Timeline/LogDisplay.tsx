import { parseLogContent } from '../../types';

interface LogDisplayProps {
  content: string;
}

export function LogDisplay({ content }: LogDisplayProps) {
  const paragraphs = parseLogContent(content);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.type === 'quote') {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-gray-200 pl-5 italic text-gray-500"
            >
              <p className="whitespace-pre-wrap">{paragraph.content}</p>
            </blockquote>
          );
        }

        return (
          <p key={index} className="whitespace-pre-wrap text-gray-900">
            {paragraph.content}
          </p>
        );
      })}
    </div>
  );
}
