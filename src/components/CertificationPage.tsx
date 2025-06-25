
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, DollarSign, BookOpen, Award, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Certification {
  id: string;
  name: string;
  description: string;
  requirements: string;
  cost: number;
  duration_days: number;
  contact_whatsapp: string;
  is_active: boolean;
  created_at: string;
}

const CertificationPage = () => {
  // Fetch certifications
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Certification[];
    },
  });

  const handleWhatsAppContact = (phone: string, certificationName: string) => {
    const message = `Halo, saya tertarik untuk mengikuti sertifikasi ${certificationName}. Mohon informasi lebih lanjut mengenai jadwal, prosedur pendaftaran, dan persyaratan yang diperlukan.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCertificationColor = (name: string) => {
    if (name.toLowerCase().includes('basic')) return 'bg-green-100 text-green-800';
    if (name.toLowerCase().includes('advanced')) return 'bg-blue-100 text-blue-800';
    if (name.toLowerCase().includes('officer')) return 'bg-purple-100 text-purple-800';
    if (name.toLowerCase().includes('engine')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Sertifikasi Maritim</h1>
        <p className="text-slate-600 mb-6">
          Tingkatkan kompetensi dan karir Anda dengan mengikuti program sertifikasi maritim yang tersedia
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Informasi Penting</span>
          </div>
          <p className="text-blue-700 text-sm">
            Semua sertifikasi yang kami tawarkan telah terakreditasi dan diakui secara internasional. 
            Hubungi kami melalui WhatsApp untuk konsultasi gratis dan informasi jadwal pelatihan.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : certifications && certifications.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCertificationColor(cert.name)}>
                    Sertifikasi
                  </Badge>
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-blue-700">{cert.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {cert.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">{formatCurrency(cert.cost)}</p>
                      <p className="text-xs text-slate-500">Biaya</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">{cert.duration_days} Hari</p>
                      <p className="text-xs text-slate-500">Durasi</p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {cert.requirements && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Persyaratan:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded">
                      {cert.requirements}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleWhatsAppContact(cert.contact_whatsapp, cert.name)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Info Detail & Jadwal
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="text-xs text-slate-500 text-center pt-2 border-t">
                  <p>WhatsApp: {cert.contact_whatsapp}</p>
                  <p>Respon dalam 1-2 jam kerja</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">Belum ada program sertifikasi yang tersedia</p>
          <p className="text-slate-400 text-sm">Silakan hubungi admin untuk informasi lebih lanjut</p>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Butuh Konsultasi?</h3>
          <p className="mb-4 opacity-90">
            Tim ahli kami siap membantu Anda memilih sertifikasi yang tepat untuk karir maritim Anda
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => handleWhatsAppContact('081991191988', 'konsultasi sertifikasi maritim')}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Konsultasi Gratis via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificationPage;
