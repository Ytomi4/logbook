import { Hono } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
import { ndlSearchSchema } from '../../../src/lib/validation';

interface Env {
  DB: D1Database;
}

interface NdlBook {
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  pubDate: string | null;
  ndlBibId: string;
}

const app = new Hono<{ Bindings: Env }>();

// GET /api/ndl/search - Search NDL (National Diet Library)
app.get('/', async (c) => {
  const query = c.req.query();
  const parseResult = ndlSearchSchema.safeParse(query);

  if (!parseResult.success) {
    return c.json(
      { message: 'Invalid query parameters', details: parseResult.error.flatten() },
      400
    );
  }

  const { title, author, isbn, cnt, idx } = parseResult.data;

  // Build NDL OpenSearch query
  const params = new URLSearchParams();

  if (title) {
    params.append('title', title);
  }
  if (author) {
    params.append('creator', author);
  }
  if (isbn) {
    params.append('isbn', isbn);
  }
  params.append('cnt', String(cnt));
  params.append('idx', String(idx));

  const ndlUrl = `https://ndlsearch.ndl.go.jp/api/opensearch?${params.toString()}`;

  try {
    const response = await fetch(ndlUrl, {
      headers: {
        'User-Agent': 'Logbook/1.0',
      },
    });

    if (!response.ok) {
      return c.json(
        { message: 'NDL API request failed', status: response.status },
        502
      );
    }

    const xmlText = await response.text();
    const items = parseNdlXml(xmlText);
    const totalResults = extractTotalResults(xmlText);

    return c.json({
      totalResults,
      items,
    });
  } catch (error) {
    console.error('NDL API error:', error);
    return c.json({ message: 'Failed to fetch from NDL API' }, 502);
  }
});

function extractTotalResults(xml: string): number {
  // Extract openSearch:totalResults from XML
  const regex = /<openSearch:totalResults>(\d+)<\/openSearch:totalResults>/;
  const match = xml.match(regex);
  return match?.[1] ? parseInt(match[1], 10) : 0;
}

function parseNdlXml(xml: string): NdlBook[] {
  const items: NdlBook[] = [];

  // Extract all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemContent = itemMatch[1];
    if (!itemContent) continue;

    const title = extractTag(itemContent, 'title') || '';
    const author = extractTag(itemContent, 'author') || extractTag(itemContent, 'dc:creator');
    const publisher = extractTag(itemContent, 'dc:publisher');
    const pubDate = extractTag(itemContent, 'pubDate') || extractTag(itemContent, 'dc:date');

    // Extract ISBN from dc:identifier
    const isbn = extractIsbn(itemContent);

    // Extract NDL Bib ID from link or guid
    const ndlBibId = extractNdlBibId(itemContent);

    if (title && ndlBibId) {
      items.push({
        title: decodeHtmlEntities(title),
        author: author ? decodeHtmlEntities(author) : null,
        publisher: publisher ? decodeHtmlEntities(publisher) : null,
        isbn,
        pubDate,
        ndlBibId,
      });
    }
  }

  return items;
}

function extractTag(content: string, tagName: string): string | null {
  // Handle both simple tags and namespaced tags
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(regex);
  return match?.[1]?.trim() ?? null;
}

function extractIsbn(content: string): string | null {
  // Look for ISBN in dc:identifier
  const identifierRegex = /<dc:identifier[^>]*xsi:type="dcndl:ISBN"[^>]*>([^<]+)<\/dc:identifier>/gi;
  let match;

  while ((match = identifierRegex.exec(content)) !== null) {
    const captured = match[1];
    if (captured) {
      const isbn = captured.replace(/[-\s]/g, '');
      if (/^\d{10}$|^\d{13}$/.test(isbn)) {
        return isbn;
      }
    }
  }

  // Fallback: look for any ISBN-like pattern
  const isbnPattern = /(?:ISBN[:\s]*)?(97[89]\d{10}|\d{10})/i;
  const isbnMatch = content.match(isbnPattern);
  return isbnMatch?.[1]?.replace(/[-\s]/g, '') ?? null;
}

function extractNdlBibId(content: string): string | null {
  // Extract from link or guid (e.g., https://ndlsearch.ndl.go.jp/books/R100000002-I000000000-00)
  const linkRegex = /<(?:link|guid)[^>]*>([^<]+)<\/(?:link|guid)>/i;
  const match = content.match(linkRegex);
  const url = match?.[1];

  if (url) {
    const bibIdMatch = url.match(/\/books\/([^/?]+)/);
    if (bibIdMatch?.[1]) {
      return bibIdMatch[1];
    }
    // Try to extract ID from the end of URL
    const idMatch = url.match(/[A-Z0-9-]+$/i);
    if (idMatch?.[0]) {
      return idMatch[0];
    }
  }

  return null;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export default app;
