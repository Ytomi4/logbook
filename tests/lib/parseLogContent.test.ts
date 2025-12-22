import { describe, it, expect } from 'vitest';
import { parseLogContent } from '../../src/types';

describe('parseLogContent', () => {
  describe('empty or null content', () => {
    it('returns empty array for empty string', () => {
      const result = parseLogContent('');
      expect(result).toEqual([]);
    });

    it('returns empty array for whitespace only', () => {
      const result = parseLogContent('   ');
      expect(result).toEqual([]);
    });

    it('returns empty array for newlines only', () => {
      const result = parseLogContent('\n\n\n');
      expect(result).toEqual([]);
    });
  });

  describe('plain text (no quotes)', () => {
    it('parses single line text', () => {
      const result = parseLogContent('This is a simple note.');
      expect(result).toEqual([
        { type: 'text', content: 'This is a simple note.' },
      ]);
    });

    it('parses multi-line text as single paragraph', () => {
      const result = parseLogContent('Line one\nLine two\nLine three');
      expect(result).toEqual([
        { type: 'text', content: 'Line one\nLine two\nLine three' },
      ]);
    });
  });

  describe('quote only content', () => {
    it('parses single line quote', () => {
      const result = parseLogContent('> This is a quote.');
      expect(result).toEqual([
        { type: 'quote', content: 'This is a quote.' },
      ]);
    });

    it('parses multi-line quote as single paragraph', () => {
      const result = parseLogContent('> Line one\n> Line two\n> Line three');
      expect(result).toEqual([
        { type: 'quote', content: 'Line one\nLine two\nLine three' },
      ]);
    });

    it('removes the "> " prefix from each line', () => {
      const result = parseLogContent('> First line\n> Second line');
      expect(result[0].content).not.toContain('> ');
      expect(result[0].content).toBe('First line\nSecond line');
    });
  });

  describe('mixed content', () => {
    it('parses quote followed by text', () => {
      const result = parseLogContent('> A great quote.\nMy thoughts on this.');
      expect(result).toEqual([
        { type: 'quote', content: 'A great quote.' },
        { type: 'text', content: 'My thoughts on this.' },
      ]);
    });

    it('parses text followed by quote', () => {
      const result = parseLogContent('I found this interesting:\n> A quote from the book.');
      expect(result).toEqual([
        { type: 'text', content: 'I found this interesting:' },
        { type: 'quote', content: 'A quote from the book.' },
      ]);
    });

    it('parses alternating quotes and text', () => {
      const result = parseLogContent(
        '> Quote one.\nText one.\n> Quote two.\nText two.'
      );
      expect(result).toEqual([
        { type: 'quote', content: 'Quote one.' },
        { type: 'text', content: 'Text one.' },
        { type: 'quote', content: 'Quote two.' },
        { type: 'text', content: 'Text two.' },
      ]);
    });

    it('parses multi-line quotes mixed with multi-line text', () => {
      const result = parseLogContent(
        '> Quote line 1\n> Quote line 2\nText line 1\nText line 2'
      );
      expect(result).toEqual([
        { type: 'quote', content: 'Quote line 1\nQuote line 2' },
        { type: 'text', content: 'Text line 1\nText line 2' },
      ]);
    });
  });

  describe('edge cases', () => {
    it('handles line starting with > but no space (not a quote)', () => {
      const result = parseLogContent('>No space after marker');
      expect(result).toEqual([
        { type: 'text', content: '>No space after marker' },
      ]);
    });

    it('handles empty quote line', () => {
      const result = parseLogContent('> ');
      expect(result).toEqual([
        { type: 'quote', content: '' },
      ]);
    });

    it('handles quote with extra spaces after marker', () => {
      // ">    spaces" starts with "> " so it's a quote, content is "   spaces"
      const result = parseLogContent('>    spaces');
      expect(result).toEqual([
        { type: 'quote', content: '   spaces' },
      ]);
    });

    it('preserves content after "> " prefix', () => {
      const result = parseLogContent('> > Nested quote marker');
      expect(result).toEqual([
        { type: 'quote', content: '> Nested quote marker' },
      ]);
    });
  });

  describe('real-world examples', () => {
    it('parses a typical book note with quote and reflection', () => {
      const content = `> The only way to do great work is to love what you do.
This quote by Steve Jobs reminds me of why I started programming.
> If you haven't found it yet, keep looking.
I need to remember this when facing challenges.`;

      const result = parseLogContent(content);
      expect(result).toHaveLength(4);
      expect(result[0].type).toBe('quote');
      expect(result[1].type).toBe('text');
      expect(result[2].type).toBe('quote');
      expect(result[3].type).toBe('text');
    });
  });
});
