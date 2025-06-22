
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContracts } from '@/hooks/useContracts';
import { Check, CreditCard, Smartphone } from 'lucide-react';

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContractDialog = ({ open, onOpenChange }: CreateContractDialogProps) => {
  const { createContract } = useContracts();
  const [selectedPlan, setSelectedPlan] = useState<'3_months' | '6_months' | '1_year'>('3_months');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'dana'>('transfer');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: '3_months' as const,
      name: '3 Bulan',
      price: 50000,
      duration: '3 bulan',
      popular: false
    },
    {
      id: '6_months' as const,
      name: '6 Bulan',
      price: 90000,
      duration: '6 bulan',
      popular: true
    },
    {
      id: '1_year' as const,
      name: '1 Tahun',
      price: 150000,
      duration: '12 bulan',
      popular: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber.trim()) return;

    setLoading(true);
    try {
      const contract = await createContract({
        contract_type: selectedPlan,
        payment_method: paymentMethod,
        whatsapp_number: whatsappNumber
      });

      if (contract) {
        onOpenChange(false);
        setWhatsappNumber('');
        setSelectedPlan('3_months');
        setPaymentMethod('transfer');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Pilih Paket Berlangganan Nahkodaku
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Pilih Paket Berlangganan</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'border-slate-200'
                  } ${plan.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Terpopuler
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(plan.price)}
                    </div>
                    <p className="text-slate-600">untuk {plan.duration}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-center">
                      {selectedPlan === plan.id ? (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Metode Pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: 'transfer' | 'dana') => setPaymentMethod(value)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={`cursor-pointer transition-all ${
                  paymentMethod === 'transfer' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <CreditCard className="h-6 w-6 text-slate-600" />
                      <div>
                        <Label htmlFor="transfer" className="font-medium cursor-pointer">
                          Transfer Bank
                        </Label>
                        <p className="text-sm text-slate-500">
                          Transfer ke rekening perusahaan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${
                  paymentMethod === 'dana' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="dana" id="dana" />
                      <Smartphone className="h-6 w-6 text-slate-600" />
                      <div>
                        <Label htmlFor="dana" className="font-medium cursor-pointer">
                          DANA
                        </Label>
                        <p className="text-sm text-slate-500">
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
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-lg font-semibold">
              Nomor WhatsApp untuk Notifikasi
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="text-lg"
            />
            <p className="text-sm text-slate-500">
              Nomor ini akan digunakan untuk notifikasi pengingat kontrak
            </p>
          </div>

          {/* Summary */}
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Paket:</span>
                  <span className="font-medium">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi:</span>
                  <span className="font-medium">
                    {plans.find(p => p.id === selectedPlan)?.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === 'dana' ? 'DANA' : 'Transfer Bank'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Instruksi Pembayaran</h3>
              <p className="text-sm text-blue-700">
                Setelah membuat kontrak, Anda akan menerima detail pembayaran. 
                Silakan kirim bukti pembayaran ke WhatsApp: <strong>081991191988</strong> untuk verifikasi.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !whatsappNumber.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Membuat Kontrak...' : 'Buat Kontrak'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractDialog;
