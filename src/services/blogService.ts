
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, CreatePostData } from '@/types/blog';

export const blogService = {
  async fetchPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(post => ({
      ...post,
      status: post.status as 'draft' | 'published'
    })) as BlogPost[];
  },

  async createPost(postData: CreatePostData, userId?: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...postData,
        author_id: userId,
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  },

  async updatePost(postId: string, postData: CreatePostData): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString(),
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  },

  async deletePost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  },

  async publishPost(postId: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  },

  async unpublishPost(postId: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  }
};
