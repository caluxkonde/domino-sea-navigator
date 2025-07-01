
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  tags: string[] | null;
  status: 'draft' | 'published';
  author_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
}
