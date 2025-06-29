
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Upload, Phone } from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

interface PremiumUpgradeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ open, onOpenChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<'1_month' | '3_months' | '1_year'>('1_month');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'dana'>('transfer');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { createContract } = useContracts();
  const { toast } = useToast();

  const plans = [
    {
      id: '1_month' as const,
      name: 'Bulanan',
      price: 100000,
      duration: '1 Bulan',
      popular: false,
    },
    {
      id: '3_months' as const,
      name: 'Triwulan',
      price: 200000,
      duration: '3 Bulan',
      popular: true,
      savings: 'Hemat Rp 100.000'
    },
    {
      id: '1_year' as const,
      name: 'Tahunan',
      price: 500000,
      duration: '12 Bulan',
      popular: false,
      savings: 'Hemat Rp 700.000'
    },
  ];

  const features = [
    'Akses ke semua halaman NaviMarine',
    'Info Pasang Surut Real-time',
    'Peta Navigasi Lengkap',
    'Manajemen Kontrak',
    'Sertifikasi Maritim',
    'CV Builder Gratis',
    'Dukungan WhatsApp Priority'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleUpgrade = async () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor WhatsApp wajib diisi untuk verifikasi pembayaran.",
        variant: "destructive",
      });
      return;
    }

    const contract = await createContract({
      contract_type: selectedPlan,
      payment_method: paymentMethod,
      whatsapp_number: whatsappNumber,
    });

    if (contract) {
      toast({
        title: "Berhasil!",
        description: "Kontrak premium telah dibuat. Silakan lakukan pembayaran dan upload bukti transfer.",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Gagal membuat kontrak. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade ke Premium
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Benefits Section */}
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-800">
                Keuntungan Akun Premium
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Dapatkan akses penuh ke semua fitur NaviMarine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pilih Paket Berlangganan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  } ${plan.popular ? 'border-yellow-400 relative' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                      Paling Populer
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(plan.price)}
                    </div>
                    <CardDescription>{plan.duration}</CardDescription>
                    {plan.savings && (
                      <Badge variant="secondary" className="text-green-600">
                        {plan.savings}
                      </Badge>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Metode Pembayaran</label>
              <Select value={paymentMethod} onValueChange={(value: 'transfer' | 'dana') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                  <SelectItem value="dana">DANA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="081234567890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Untuk verifikasi pembayaran ke 081991191988
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2">Informasi Pembayaran:</h4>
              <ul className="text-sm space-y-1 text-blue-800">
                <li>• Setelah klik "Upgrade Sekarang", Anda akan diarahkan ke halaman kontrak</li>
                <li>• Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>• Upload bukti pembayaran di halaman kontrak</li>
                <li>• Admin akan memverifikasi pembayaran melalui WhatsApp</li>
                <li>• Akun Premium aktif setelah verifikasi selesai</li>
              </ul>
            </CardContent>
          </Card>

          <Button onClick={handleUpgrade} className="w-full" size="lg">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Sekarang - {formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgrade;
