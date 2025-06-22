
import React, { useState } from 'react';
import { Plus, FileText, Calendar, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
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
      return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Menunggu Verifikasi</Badge>;
    }
    if (paymentStatus === 'failed') {
      return <Badge variant="destructive">Pembayaran Gagal</Badge>;
    }
    if (status === 'active') {
      return <Badge variant="default" className="bg-green-600">Aktif</Badge>;
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sistem Kontrak Nahkodaku</h2>
          <p className="text-slate-600">Kelola kontrak berlangganan pekerja kantor</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Kontrak Baru
        </Button>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Belum Ada Kontrak</h3>
            <p className="text-slate-500 mb-4">Mulai dengan membuat kontrak berlangganan pertama Anda</p>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Buat Kontrak
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Paket {getContractTypeLabel(contract.contract_type)}
                  </CardTitle>
                  {getStatusBadge(contract.status, contract.payment_status)}
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(contract.price)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Berakhir: {format(new Date(contract.end_date), 'dd MMMM yyyy', { locale: id })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">
                    Pembayaran: {contract.payment_method === 'dana' ? 'DANA' : 'Transfer Bank'}
                  </span>
                </div>

                {contract.whatsapp_number && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span>📱 WhatsApp: {contract.whatsapp_number}</span>
                  </div>
                )}

                {contract.payment_status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Menunggu Verifikasi Pembayaran</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Silakan kirim bukti pembayaran ke WhatsApp: 081991191988
                    </p>
                  </div>
                )}

                {contract.payment_status === 'verified' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Pembayaran Terverifikasi</span>
                    </div>
                  </div>
                )}

                {contract.payment_status === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-800">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Pembayaran Ditolak</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      Silakan hubungi WhatsApp: 081991191988 untuk informasi lebih lanjut
                    </p>
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
