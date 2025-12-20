interface QuoteDisplayProps {
  content: string;
}

export function QuoteDisplay({ content }: QuoteDisplayProps) {
  return (
    <blockquote className="border-l-4 border-gray-200 pl-5 italic text-gray-500">
      <p className="whitespace-pre-wrap">{content}</p>
    </blockquote>
  );
}
