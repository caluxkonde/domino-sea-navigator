import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Search, Calendar, MapPin, DollarSign, Users, MessageCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_range: string;
  job_type: string;
  experience_level: string;
  status: string;
  application_deadline: string;
  contact_info: string;
  created_at: string;
}

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'jobs'>('blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ['blog-posts', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  // Fetch job postings
  const { data: jobPostings, isLoading: jobsLoading } = useQuery({
    queryKey: ['job-postings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobPosting[];
    },
  });

  const filteredBlogPosts = blogPosts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredJobPostings = jobPostings?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      job: 'bg-green-100 text-green-800',
      news: 'bg-blue-100 text-blue-800',
      info: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'contract': 'bg-yellow-100 text-yellow-800',
      'internship': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || colors['full-time'];
  };

  const handleWhatsAppContact = (phone: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Blog & Informasi</h1>
        <p className="text-slate-600 mb-6">
          Temukan informasi terbaru, lowongan pekerjaan, dan artikel menarik seputar dunia maritim
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'blog' ? 'default' : 'outline'}
            onClick={() => setActiveTab('blog')}
            className="flex items-center gap-2"
          >
            Blog & Artikel
          </Button>
          <Button
            variant={activeTab === 'jobs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Lowongan Kerja
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari artikel atau lowongan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'blog' && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="job">Pekerjaan</SelectItem>
                <SelectItem value="news">Berita</SelectItem>
                <SelectItem value="info">Informasi</SelectItem>
                <SelectItem value="general">Umum</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Blog Posts Tab */}
      {activeTab === 'blog' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredBlogPosts.length > 0 ? (
            filteredBlogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                {post.featured_image_url && (
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-slate-500">Gambar Blog</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </Badge>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Baca Selengkapnya
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">Tidak ada artikel yang ditemukan</p>
            </div>
          )}
        </div>
      )}

      {/* Job Postings Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {jobsLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredJobPostings.length > 0 ? (
            filteredJobPostings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-blue-700">{job.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-slate-700">
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getJobTypeColor(job.job_type)}>
                        {job.job_type}
                      </Badge>
                      <Badge variant="outline">
                        {job.experience_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                    {job.application_deadline && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {formatDate(job.application_deadline)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Deskripsi Pekerjaan:</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {job.description.length > 200 
                        ? `${job.description.substring(0, 200)}...` 
                        : job.description
                      }
                    </p>
                  </div>

                  {job.requirements && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Persyaratan:</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {job.requirements.length > 150 
                          ? `${job.requirements.substring(0, 150)}...` 
                          : job.requirements
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleWhatsAppContact('081991191988', 
                        `Halo, saya tertarik dengan lowongan ${job.title} di ${job.company}. Mohon informasi lebih lanjut.`
                      )}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Lamar via WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Detail Lengkap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Tidak ada lowongan pekerjaan yang tersedia</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
