import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  Search
} from 'lucide-react';
import { useBlogManagement } from '@/hooks/useBlogManagement';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const { 
    posts, 
    loading, 
    createPost, 
    updatePost, 
    deletePost,
    publishPost,
    unpublishPost 
  } = useBlogManagement();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    post_type: 'article' as 'article' | 'job',
    company: '',
    location: '',
    salary_range: '',
    application_deadline: '',
    requirements: '',
    job_type: 'full-time',
    experience_level: 'entry'
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (editingPost) {
      await updatePost(editingPost.id, postData);
      setEditingPost(null);
    } else {
      await createPost(postData);
    }

    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      tags: '',
      status: 'draft',
      post_type: 'article',
      company: '',
      location: '',
      salary_range: '',
      application_deadline: '',
      requirements: '',
      job_type: 'full-time',
      experience_level: 'entry'
    });
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags?.join(', ') || '',
      status: post.status,
      post_type: 'article',
      company: '',
      location: '',
      salary_range: '',
      application_deadline: '',
      requirements: '',
      job_type: 'full-time',
      experience_level: 'entry'
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      await deletePost(postId);
    }
  };

  const handleStatusToggle = async (post: BlogPost) => {
    if (post.status === 'published') {
      await unpublishPost(post.id);
    } else {
      await publishPost(post.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Blog & Artikel</h2>
            <p className="text-slate-600">Kelola konten artikel dan blog untuk pengguna</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Tulis Artikel Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="post_type">Tipe Konten</Label>
                    <Select value={formData.post_type} onValueChange={(value: 'article' | 'job') => setFormData({...formData, post_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Artikel</SelectItem>
                        <SelectItem value="job">Lowongan Kerja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="title">{formData.post_type === 'job' ? 'Judul Lowongan' : 'Judul Artikel'}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder={formData.post_type === 'job' ? 'Masukkan judul lowongan...' : 'Masukkan judul artikel...'}
                      required
                    />
                  </div>

                  {formData.post_type === 'job' && (
                    <>
                      <div>
                        <Label htmlFor="company">Nama Perusahaan</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Nama perusahaan..."
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Lokasi kerja..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="salary_range">Rentang Gaji</Label>
                        <Input
                          id="salary_range"
                          value={formData.salary_range}
                          onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                          placeholder="Contoh: 5-10 juta"
                        />
                      </div>

                      <div>
                        <Label htmlFor="application_deadline">Batas Lamaran</Label>
                        <Input
                          id="application_deadline"
                          type="date"
                          value={formData.application_deadline}
                          onChange={(e) => setFormData({...formData, application_deadline: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="job_type">Tipe Pekerjaan</Label>
                        <Select value={formData.job_type} onValueChange={(value) => setFormData({...formData, job_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Kontrak</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="experience_level">Level Pengalaman</Label>
                        <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                            <SelectItem value="lead">Lead/Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Umum</SelectItem>
                        <SelectItem value="maritime">Maritim</SelectItem>
                        <SelectItem value="safety">Keselamatan</SelectItem>
                        <SelectItem value="technology">Teknologi</SelectItem>
                        <SelectItem value="career">Karir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="excerpt">Ringkasan</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Tulis ringkasan artikel..."
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="content">Konten Artikel</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Tulis konten artikel lengkap..."
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Publikasikan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingPost(null);
                      setFormData({
                        title: '',
                        content: '',
                        excerpt: '',
                        category: 'general',
                        tags: '',
                        status: 'draft',
                        post_type: 'article',
                        company: '',
                        location: '',
                        salary_range: '',
                        application_deadline: '',
                        requirements: '',
                        job_type: 'full-time',
                        experience_level: 'entry'
                      });
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingPost ? 'Update Artikel' : 'Simpan Artikel'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filter & Pencarian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari artikel berdasarkan judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="published">Dipublikasikan</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {post.category}
                    </Badge>
                    <Badge 
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {post.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </div>
              {post.excerpt && (
                <p className="text-sm text-slate-600 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.created_at), 'dd MMM yyyy', { locale: id })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>0 views</span>
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusToggle(post)}
                  className={post.status === 'published' ? 'text-orange-600' : 'text-green-600'}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(post)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak Ada Artikel</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tidak ada artikel yang sesuai dengan filter Anda'
                : 'Mulai menulis artikel pertama Anda'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tulis Artikel Baru
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogManagement;
