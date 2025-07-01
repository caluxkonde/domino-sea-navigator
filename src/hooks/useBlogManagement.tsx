
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
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

interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
}

export const useBlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published'
      })) as BlogPost[]);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data artikel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostData) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          author_id: user?.id,
          published_at: postData.status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'draft' | 'published'
      } as BlogPost;

      setPosts(prev => [typedData, ...prev]);
      toast({
        title: 'Berhasil',
        description: 'Artikel berhasil dibuat',
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat artikel',
        variant: 'destructive',
      });
    }
  };

  const updatePost = async (postId: string, postData: CreatePostData) => {
    try {
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

      const typedData = {
        ...data,
        status: data.status as 'draft' | 'published'
      } as BlogPost;

      setPosts(prev => prev.map(post => post.id === postId ? typedData : post));
      toast({
        title: 'Berhasil',
        description: 'Artikel berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui artikel',
        variant: 'destructive',
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: 'Berhasil',
        description: 'Artikel berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus artikel',
        variant: 'destructive',
      });
    }
  };

  const publishPost = async (postId: string) => {
    try {
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

      const typedData = {
        ...data,
        status: data.status as 'draft' | 'published'
      } as BlogPost;

      setPosts(prev => prev.map(post => post.id === postId ? typedData : post));
      toast({
        title: 'Berhasil',
        description: 'Artikel berhasil dipublikasikan',
      });
    } catch (error) {
      console.error('Error publishing blog post:', error);
      toast({
        title: 'Error',
        description: 'Gagal mempublikasikan artikel',
        variant: 'destructive',
      });
    }
  };

  const unpublishPost = async (postId: string) => {
    try {
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

      const typedData = {
        ...data,
        status: data.status as 'draft' | 'published'
      } as BlogPost;

      setPosts(prev => prev.map(post => post.id === postId ? typedData : post));
      toast({
        title: 'Berhasil',
        description: 'Artikel berhasil di-unpublish',
      });
    } catch (error) {
      console.error('Error unpublishing blog post:', error);
      toast({
        title: 'Error',
        description: 'Gagal meng-unpublish artikel',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    refetch: fetchPosts
  };
};
