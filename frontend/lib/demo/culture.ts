import type { CulturePost } from './types';

export interface CultureFilters {
  category?: string;
  status?: string;
  from?: string;
  to?: string;
  search?: string;
}

export function filterCulturePosts(posts: CulturePost[], filters: CultureFilters): CulturePost[] {
  const search = filters.search?.trim().toLowerCase() ?? '';

  return posts.filter((post) => {
    if (filters.category && filters.category !== 'ALL' && post.category !== filters.category) {
      return false;
    }
    if (filters.status && filters.status !== 'ALL' && post.status !== filters.status) {
      return false;
    }
    if (filters.from && post.date < filters.from) return false;
    if (filters.to && post.date > filters.to) return false;
    if (search) {
      const haystack = `${post.title} ${post.description} ${post.pic} ${post.goal}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function sortCulturePostsByDate(posts: CulturePost[]): CulturePost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
