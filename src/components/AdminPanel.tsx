
import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, User, Calendar, CreditCard, Phone, MessageSquare, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAdminContracts } from '@/hooks/useAdminContracts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AdminPanel = () => {
  const { contracts, loading, acceptContract, rejectContract } = useAdminContracts();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleAccept = async (contractId: string) => {
    setActionLoading(true);
    const success = await acceptContract(contractId, adminNotes);
    if (success) {
      setSelectedContract(null);
      setAdminNotes('');
    }
    setActionLoading(false);
  };

  const handleReject = async (contractId: string) => {
    setActionLoading(true);
    const success = await rejectContract(contractId, adminNotes);
    if (success) {
      setSelectedContract(null);
      setAdminNotes('');
    }
    setActionLoading(false);
  };

  const handleWhatsAppContact = (whatsappNumber?: string) => {
    if (!whatsappNumber) return;
    const message = encodeURIComponent('Halo, ini adalah admin Nahkodaku. Saya ingin menghubungi Anda terkait kontrak berlangganan Anda.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case '3_months': return '3 Bulan';
      case '6_months': return '6 Bulan';
      case '1_year': return '1 Tahun';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data kontrak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Panel Administrator</h2>
            <p className="text-slate-600 text-lg">Kelola persetujuan kontrak berlangganan</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-slate-800">{contracts.length}</p>
                <p className="text-sm text-slate-600">Kontrak Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contracts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="text-center py-16">
            <div className="bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">Tidak Ada Kontrak Pending</h3>
            <p className="text-slate-500">Semua kontrak telah diproses</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">
                        Paket {getContractTypeLabel(contract.contract_type)}
                      </CardTitle>
                      <p className="text-sm text-slate-500">ID: {contract.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                    Pending
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-700">
                    {formatPrice(contract.price)}
                  </p>
                  <p className="text-sm text-blue-600">Paket berlangganan</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">Pengguna</p>
                      <p className="font-medium text-slate-700">
                        {contract.profiles?.full_name || 'N/A'}
                      </p>
                      <p className="text-xs text-slate-500">{contract.profiles?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">Tanggal Pembuatan</p>
                      <p className="font-medium text-slate-700">
                        {format(new Date(contract.created_at), 'dd MMMM yyyy', { locale: id })}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="bg-slate-100 p-1.5 rounded">
                          <Phone className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-slate-500">WhatsApp</p>
                          <p className="font-medium text-slate-700">{contract.whatsapp_number}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleWhatsAppContact(contract.whatsapp_number)}
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {selectedContract === contract.id && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>Catatan Admin (opsional)</span>
                    </div>
                    <Textarea
                      placeholder="Tambahkan catatan untuk user..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  {selectedContract === contract.id ? (
                    <>
                      <Button
                        onClick={() => handleAccept(contract.id)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {actionLoading ? 'Memproses...' : 'Setujui'}
                      </Button>
                      <Button
                        onClick={() => handleReject(contract.id)}
                        disabled={actionLoading}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {actionLoading ? 'Memproses...' : 'Tolak'}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedContract(null);
                          setAdminNotes('');
                        }}
                        variant="outline"
                        disabled={actionLoading}
                      >
                        Batal
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setSelectedContract(contract.id)}
                      className="w-full"
                      variant="outline"
                    >
                      Proses Kontrak
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
