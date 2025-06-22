
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContracts } from '@/hooks/useContracts';
import { Check, CreditCard, Smartphone, Crown, Star, Zap, Phone, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContractDialog = ({ open, onOpenChange }: CreateContractDialogProps) => {
  const { createContract } = useContracts();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'3_months' | '6_months' | '1_year'>('6_months');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'dana'>('transfer');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: '3_months' as const,
      name: '3 Bulan',
      price: 50000,
      duration: '3 bulan',
      popular: false,
      icon: Zap,
      description: 'Cocok untuk percobaan'
    },
    {
      id: '6_months' as const,
      name: '6 Bulan',
      price: 90000,
      duration: '6 bulan',
      popular: true,
      icon: Star,
      description: 'Paling populer, hemat 25%'
    },
    {
      id: '1_year' as const,
      name: '1 Tahun',
      price: 150000,
      duration: '12 bulan',
      popular: false,
      icon: Crown,
      description: 'Nilai terbaik, hemat 37%'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateMonthlyPrice = (price: number, months: number) => {
    return formatPrice(price / months);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor WhatsApp harus diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const contract = await createContract({
        contract_type: selectedPlan,
        payment_method: paymentMethod,
        whatsapp_number: whatsappNumber
      });

      if (contract) {
        toast({
          title: "Berhasil!",
          description: "Kontrak berhasil dibuat. Silakan lakukan pembayaran dan kirim bukti ke WhatsApp kami.",
        });
        onOpenChange(false);
        setWhatsappNumber('');
        setSelectedPlan('6_months');
        setPaymentMethod('transfer');
      } else {
        throw new Error('Failed to create contract');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Gagal membuat kontrak. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pilih Paket Berlangganan Nahkodaku
          </DialogTitle>
          <p className="text-slate-600 text-lg">Dapatkan akses penuh ke sistem navigasi maritim profesional</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <div className="text-center">
              <Label className="text-xl font-semibold text-slate-800">Pilih Paket Berlangganan</Label>
              <p className="text-slate-600 mt-1">Semua paket termasuk akses penuh ke fitur navigasi</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedPlan === plan.id 
                        ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                        : 'border-slate-200 hover:border-blue-300'
                    } ${plan.popular ? 'relative scale-105' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          🏆 Terpopuler
                        </span>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4 pt-6">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full ${
                          selectedPlan === plan.id ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          <Icon className={`h-8 w-8 ${
                            selectedPlan === plan.id ? 'text-blue-600' : 'text-slate-600'
                          }`} />
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <p className="text-slate-600">{plan.description}</p>
                      
                      <div className="mt-4">
                        <div className="text-4xl font-bold text-blue-600">
                          {formatPrice(plan.price)}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {calculateMonthlyPrice(plan.price, plan.id === '3_months' ? 3 : plan.id === '6_months' ? 6 : 12)}/bulan
                        </div>
                        <p className="text-slate-600 mt-2">untuk {plan.duration}</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-center mb-4">
                        {selectedPlan === plan.id ? (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 border-2 border-slate-300 rounded-full" />
                        )}
                      </div>
                      
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Akses penuh sistem navigasi
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Manajemen kapal unlimited
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Notifikasi WhatsApp
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Support 24/7
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label className="text-xl font-semibold text-slate-800">Metode Pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: 'transfer' | 'dana') => setPaymentMethod(value)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={`cursor-pointer transition-all ${
                  paymentMethod === 'transfer' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:border-blue-300'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="transfer" className="font-semibold cursor-pointer text-lg">
                          Transfer Bank
                        </Label>
                        <p className="text-sm text-slate-500 mt-1">
                          Transfer ke rekening perusahaan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${
                  paymentMethod === 'dana' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:border-blue-300'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value="dana" id="dana" />
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="dana" className="font-semibold cursor-pointer text-lg">
                          DANA
                        </Label>
                        <p className="text-sm text-slate-500 mt-1">
                          Bayar dengan aplikasi DANA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-3">
            <Label htmlFor="whatsapp" className="text-xl font-semibold text-slate-800 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Nomor WhatsApp untuk Notifikasi
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="text-lg h-12"
            />
            <p className="text-sm text-slate-500 flex items-start">
              <Info className="h-4 w-4 mr-1 mt-0.5 text-blue-500" />
              Nomor ini akan digunakan untuk notifikasi pengingat kontrak dan komunikasi support
            </p>
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4 text-slate-800">Ringkasan Pesanan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Paket:</span>
                  <span className="font-semibold text-slate-800">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Durasi:</span>
                  <span className="font-semibold text-slate-800">
                    {plans.find(p => p.id === selectedPlan)?.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Metode Pembayaran:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {paymentMethod === 'dana' ? 'DANA' : 'Transfer Bank'}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Instruksi Pembayaran
              </h3>
              <div className="space-y-2 text-sm text-amber-700">
                <p>• Setelah membuat kontrak, Anda akan menerima detail pembayaran</p>
                <p>• Lakukan pembayaran sesuai nominal yang tertera</p>
                <p>• Kirim bukti pembayaran ke WhatsApp: <strong>081991191988</strong></p>
                <p>• Tim kami akan memverifikasi dalam 1x24 jam</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !whatsappNumber.trim()}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Membuat Kontrak...
                </div>
              ) : (
                'Buat Kontrak'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractDialog;
