
import { useBlogPosts } from './useBlogPosts';
import { useBlogActions } from './useBlogActions';

export const useBlogManagement = () => {
  const { posts, loading, refetch, setPosts } = useBlogPosts();
  const blogActions = useBlogActions(setPosts);

  return {
    posts,
    loading,
    refetch,
    ...blogActions
  };
};
