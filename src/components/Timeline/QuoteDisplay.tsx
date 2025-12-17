interface QuoteDisplayProps {
  content: string;
}

export function QuoteDisplay({ content }: QuoteDisplayProps) {
  return (
    <blockquote className="border-l-4 border-amber-400 pl-4 py-1 italic text-gray-700 bg-amber-50/50 rounded-r">
      <p className="whitespace-pre-wrap">{content}</p>
    </blockquote>
  );
}
