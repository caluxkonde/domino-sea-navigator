
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Plus, Trash2, Edit, Star, Crown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CVPurchaseDialog from './CVPurchaseDialog';

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  template_data: any;
  preview_image_url: string;
  is_active: boolean;
}

interface UserCV {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  cv_data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CVBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [cvTitle, setCvTitle] = useState('');
  const [cvData, setCvData] = useState<any>({});
  const [isCreatingCV, setIsCreatingCV] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch CV templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['cv-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cv_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CVTemplate[];
    },
  });

  // Fetch user CVs
  const { data: userCVs, isLoading: cvsLoading } = useQuery({
    queryKey: ['user-cvs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserCV[];
    },
    enabled: !!user,
  });

  // Create CV mutation
  const createCVMutation = useMutation({
    mutationFn: async (newCV: { template_id: string; title: string; cv_data: any }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_cvs')
        .insert({
          user_id: user.id,
          ...newCV,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cvs'] });
      toast({
        title: "CV Berhasil Dibuat",
        description: "CV Anda telah berhasil dibuat dan disimpan.",
      });
      setIsCreatingCV(false);
      setCvTitle('');
      setCvData({});
      setSelectedTemplate('');
    },
    onError: (error) => {
      console.error('Error creating CV:', error);
      toast({
        title: "Error",
        description: "Gagal membuat CV. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Delete CV mutation
  const deleteCVMutation = useMutation({
    mutationFn: async (cvId: string) => {
      const { error } = await supabase
        .from('user_cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cvs'] });
      toast({
        title: "CV Dihapus",
        description: "CV telah berhasil dihapus.",
      });
    },
  });

  const handleCreateCV = () => {
    if (!selectedTemplate || !cvTitle.trim()) {
      toast({
        title: "Error",
        description: "Pilih template dan masukkan judul CV.",
        variant: "destructive",
      });
      return;
    }

    const template = templates?.find(t => t.id === selectedTemplate);
    if (!template) return;

    createCVMutation.mutate({
      template_id: selectedTemplate,
      title: cvTitle,
      cv_data: {
        ...cvData,
        template_style: template.template_data,
      },
    });
  };

  const getTemplateColor = (templateName: string) => {
    const colors = {
      'Classic Professional': 'border-blue-200 bg-blue-50',
      'Modern Creative': 'border-purple-200 bg-purple-50',
      'Maritime Specialist': 'border-blue-600 bg-blue-100',
      'Simple Elegant': 'border-gray-200 bg-gray-50',
      'Executive Premium': 'border-yellow-200 bg-yellow-50',
    };
    return colors[templateName as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">CV Builder</h1>
        <p className="text-slate-600 mb-6">
          Buat CV profesional dengan template gratis atau upgrade ke CV premium untuk hasil yang lebih menarik
        </p>
      </div>

      {/* Premium CV Section */}
      <Card className="mb-8 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            CV Premium Tersedia
          </CardTitle>
          <CardDescription>
            Dapatkan CV profesional dengan desain eksklusif dan konsultasi personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Star className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <h3 className="font-semibold">Silver CV</h3>
              <p className="text-2xl font-bold text-blue-600">Rp 20.000</p>
              <p className="text-sm text-gray-600">Template Profesional</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-300">
              <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <h3 className="font-semibold">Gold CV</h3>
              <p className="text-2xl font-bold text-yellow-600">Rp 50.000</p>
              <p className="text-sm text-gray-600">+ Konsultasi Personal</p>
              <Badge className="mt-1 bg-yellow-500">Terpopuler</Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Crown className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Platinum CV</h3>
              <p className="text-2xl font-bold text-purple-600">Rp 100.000</p>
              <p className="text-sm text-gray-600">+ Revisi Unlimited</p>
            </div>
          </div>
          <Button onClick={() => setShowPurchaseDialog(true)} className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Beli CV Premium
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Template CV Gratis</TabsTrigger>
          <TabsTrigger value="my-cvs">CV Saya</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Template CV Gratis</h2>
            <Dialog open={isCreatingCV} onOpenChange={setIsCreatingCV}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Buat CV Gratis
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Buat CV Gratis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Judul CV</label>
                    <Input
                      placeholder="Misal: CV Software Engineer"
                      value={cvTitle}
                      onChange={(e) => setCvTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Template</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates?.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateCV} 
                    className="w-full"
                    disabled={createCVMutation.isPending}
                  >
                    {createCVMutation.isPending ? 'Membuat...' : 'Buat CV'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templatesLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              templates?.map((template) => (
                <Card key={template.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${getTemplateColor(template.name)}`}>
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center">
                    <FileText className="h-16 w-16 text-slate-400" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">Gratis</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setIsCreatingCV(true);
                        }}
                      >
                        Pilih
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* My CVs Tab */}
        <TabsContent value="my-cvs" className="space-y-6">
          <h2 className="text-2xl font-semibold">CV Saya</h2>
          
          {cvsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userCVs && userCVs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userCVs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cv.title}</CardTitle>
                        <CardDescription>
                          Dibuat: {new Date(cv.created_at).toLocaleDateString('id-ID')}
                        </CardDescription>
                      </div>
                      {cv.is_active && (
                        <Badge variant="default" className="text-xs">
                          Aktif
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteCVMutation.mutate(cv.id)}
                        disabled={deleteCVMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">Anda belum memiliki CV</p>
              <Button onClick={() => setIsCreatingCV(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buat CV Pertama
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CVPurchaseDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog} 
      />
    </div>
  );
};

export default CVBuilder;
