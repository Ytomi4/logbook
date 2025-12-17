import { apiClient } from './api';
import type { NdlSearchResults } from '../types';

interface NdlSearchParams {
  title?: string;
  author?: string;
  isbn?: string;
  cnt?: number;
}

export async function searchNdl(params: NdlSearchParams): Promise<NdlSearchResults> {
  const searchParams = new URLSearchParams();

  if (params.title) {
    searchParams.append('title', params.title);
  }
  if (params.author) {
    searchParams.append('author', params.author);
  }
  if (params.isbn) {
    searchParams.append('isbn', params.isbn);
  }
  if (params.cnt) {
    searchParams.append('cnt', String(params.cnt));
  }

  const query = searchParams.toString();
  const url = query ? `/ndl/search?${query}` : '/ndl/search';

  return apiClient.get<NdlSearchResults>(url);
}
