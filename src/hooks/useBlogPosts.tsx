
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const data = await blogService.fetchPosts();
      setPosts(data);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    refetch: fetchPosts,
    setPosts
  };
};
