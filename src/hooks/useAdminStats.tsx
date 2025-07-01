
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  publishedArticles: number;
  draftArticles: number;
  activeJobs: number;
  totalApplications: number;
  pendingNotifications: number;
  recentActivities: Array<{
    title: string;
    description: string;
    time: string;
  }>;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    publishedArticles: 0,
    draftArticles: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingNotifications: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at');

      const totalUsers = users?.length || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newUsersThisMonth = users?.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length || 0;

      // Fetch blog stats
      const { data: publishedBlog } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('status', 'published');

      const { data: draftBlog } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('status', 'draft');

      // Fetch job stats
      const { data: activeJobsData } = await supabase
        .from('job_postings')
        .select('id')
        .eq('status', 'active');

      // Fetch notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id')
        .eq('is_read', false);

      // Mock recent activities (replace with real data)
      const recentActivities = [
        {
          title: 'User baru mendaftar',
          description: 'John Doe telah bergabung dengan sistem',
          time: '2 jam lalu'
        },
        {
          title: 'Artikel baru dipublikasikan',
          description: 'Artikel "Keselamatan Maritim" telah dipublikasikan',
          time: '5 jam lalu'
        },
        {
          title: 'Lowongan baru ditambahkan',
          description: 'Lowongan "Nahkoda Kapal" telah ditambahkan',
          time: '1 hari lalu'
        }
      ];

      setStats({
        totalUsers,
        newUsersThisMonth,
        publishedArticles: publishedBlog?.length || 0,
        draftArticles: draftBlog?.length || 0,
        activeJobs: activeJobsData?.length || 0,
        totalApplications: 0, // Implement when application system is ready
        pendingNotifications: notifications?.length || 0,
        recentActivities
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};
