
import React from 'react';
import { CreditCard, CheckCircle, Calendar, Clock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

interface Contract {
  id: string;
  contract_type: string;
  price: number;
  status: string;
  payment_status: string;
  start_date: string;
  end_date: string;
  whatsapp_number?: string;
  created_at: string;
}

interface UserContractStatusProps {
  contracts: Contract[];
  activeContract: Contract | undefined;
}

const UserContractStatus: React.FC<UserContractStatusProps> = ({ contracts, activeContract }) => {
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

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };

  return (
    <>
      {/* Contract Status */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span>Status Kontrak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeContract ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Kontrak Aktif</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  Paket {getContractTypeLabel(activeContract.contract_type)}
                </p>
                <p className="text-sm text-green-600">{formatPrice(activeContract.price)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 p-2 rounded">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dimulai</p>
                    <p className="font-medium text-slate-700">
                      {format(new Date(activeContract.start_date), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 p-2 rounded">
                    <Clock className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Berakhir</p>
                    <p className="font-medium text-slate-700">
                      {format(new Date(activeContract.end_date), 'dd MMMM yyyy', { locale: id })}
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                      {getDaysRemaining(activeContract.end_date)} hari tersisa
                    </p>
                  </div>
                </div>

                {activeContract.whatsapp_number && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-100 p-2 rounded">
                      <Phone className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">WhatsApp Terdaftar</p>
                      <p className="font-medium text-slate-700">{activeContract.whatsapp_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Tidak Ada Kontrak Aktif</h3>
              <p className="text-slate-500 text-sm">
                Silakan buat kontrak berlangganan untuk mengakses semua fitur
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Contracts */}
      {contracts.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Riwayat Kontrak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.slice(0, 5).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded">
                      <CreditCard className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">
                        Paket {getContractTypeLabel(contract.contract_type)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {format(new Date(contract.created_at), 'dd MMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{formatPrice(contract.price)}</p>
                    <Badge 
                      className={
                        contract.payment_status === 'verified' 
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : contract.payment_status === 'pending'
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                      }
                    >
                      {contract.payment_status === 'verified' ? 'Terverifikasi' :
                       contract.payment_status === 'pending' ? 'Pending' : 'Ditolak'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default UserContractStatus;
