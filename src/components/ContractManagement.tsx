
import React, { useState } from 'react';
import { Plus, FileText, Calendar, CreditCard, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContracts } from '@/hooks/useContracts';
import CreateContractDialog from './CreateContractDialog';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ContractManagement = () => {
  const { contracts, loading } = useContracts();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'pending') {
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Menunggu Verifikasi</Badge>;
    }
    if (paymentStatus === 'failed') {
      return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">Pembayaran Ditolak</Badge>;
    }
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-700 border-green-300">Aktif</Badge>;
    }
    if (status === 'expired') {
      return <Badge variant="destructive">Kadaluarsa</Badge>;
    }
    return <Badge variant="secondary">Dibatalkan</Badge>;
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case '3_months': return '3 Bulan';
      case '6_months': return '6 Bulan';
      case '1_year': return '1 Tahun';
      default: return type;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat kontrak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sistem Kontrak Nahkodaku</h2>
            <p className="text-slate-600 text-lg">Kelola kontrak berlangganan pekerja kantor dengan mudah</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Buat Kontrak Baru
          </Button>
        </div>
      </div>

      {contracts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="text-center py-16">
            <div className="bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">Belum Ada Kontrak</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Mulai dengan membuat kontrak berlangganan pertama Anda untuk mengakses sistem Nahkodaku
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Buat Kontrak Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        Paket {getContractTypeLabel(contract.contract_type)}
                      </CardTitle>
                      <p className="text-sm text-slate-500">ID: {contract.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  {getStatusBadge(contract.status, contract.payment_status)}
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-700">
                    {formatPrice(contract.price)}
                  </p>
                  <p className="text-sm text-blue-600">untuk {contract.duration_months} bulan</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">Berakhir pada</p>
                      <p className="font-medium text-slate-700">
                        {format(new Date(contract.end_date), 'dd MMMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded">
                      <CreditCard className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">Metode Pembayaran</p>
                      <p className="font-medium text-slate-700 capitalize">
                        {contract.payment_method === 'dana' ? 'DANA' : 'Transfer Bank'}
                      </p>
                    </div>
                  </div>

                  {contract.whatsapp_number && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="bg-slate-100 p-1.5 rounded">
                        <Phone className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-500">WhatsApp</p>
                        <p className="font-medium text-slate-700">{contract.whatsapp_number}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {contract.payment_status === 'pending' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Menunggu Verifikasi Pembayaran</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Silakan kirim bukti pembayaran ke WhatsApp: 
                          <span className="font-semibold"> 081991191988</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {contract.payment_status === 'verified' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Pembayaran Terverifikasi</p>
                        <p className="text-sm text-green-700">Kontrak Anda sudah aktif dan dapat digunakan</p>
                      </div>
                    </div>
                  </div>
                )}

                {contract.payment_status === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Pembayaran Ditolak</p>
                        <p className="text-sm text-red-700 mt-1">
                          Silakan hubungi WhatsApp: 
                          <span className="font-semibold"> 081991191988</span> untuk informasi lebih lanjut
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateContractDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default ContractManagement;
