
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { blogService } from '@/services/blogService';
import { BlogPost, CreatePostData } from '@/types/blog';

export const useBlogActions = (
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createPost = async (postData: CreatePostData) => {
    try {
      const newPost = await blogService.createPost(postData, user?.id);
      setPosts(prev => [newPost, ...prev]);
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
      const updatedPost = await blogService.updatePost(postId, postData);
      setPosts(prev => prev.map(post => post.id === postId ? updatedPost : post));
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
      await blogService.deletePost(postId);
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
      const publishedPost = await blogService.publishPost(postId);
      setPosts(prev => prev.map(post => post.id === postId ? publishedPost : post));
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
      const unpublishedPost = await blogService.unpublishPost(postId);
      setPosts(prev => prev.map(post => post.id === postId ? unpublishedPost : post));
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

  return {
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost
  };
};
