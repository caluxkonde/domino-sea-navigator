
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Check, Phone } from 'lucide-react';
import { useCVPurchases } from '@/hooks/useCVPurchases';
import { useToast } from '@/hooks/use-toast';

interface CVPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CVPurchaseDialog: React.FC<CVPurchaseDialogProps> = ({ open, onOpenChange }) => {
  const [selectedType, setSelectedType] = useState<'silver' | 'gold' | 'platinum'>('silver');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'dana'>('transfer');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { createCVPurchase } = useCVPurchases();
  const { toast } = useToast();

  const cvTypes = [
    {
      id: 'silver' as const,
      name: 'Silver CV',
      price: 20000,
      features: ['Template Profesional', 'Format PDF', 'Bantuan Dasar']
    },
    {
      id: 'gold' as const,
      name: 'Gold CV',
      price: 50000,
      features: ['Template Premium', 'Format PDF + Word', 'Konsultasi Personal', 'Revisi 1x'],
      popular: true
    },
    {
      id: 'platinum' as const,
      name: 'Platinum CV',
      price: 100000,
      features: ['Template Eksklusif', 'Multi Format', 'Konsultasi Lengkap', 'Revisi Unlimited', 'Cover Letter']
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePurchase = async () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor WhatsApp wajib diisi untuk verifikasi pembayaran.",
        variant: "destructive",
      });
      return;
    }

    const purchase = await createCVPurchase({
      cv_type: selectedType,
      payment_method: paymentMethod,
      whatsapp_number: whatsappNumber,
    });

    if (purchase) {
      toast({
        title: "Berhasil!",
        description: "Pembelian CV telah dibuat. Silakan lakukan pembayaran dan hubungi WhatsApp untuk verifikasi.",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Gagal membuat pembelian. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-yellow-500" />
            Beli CV Premium
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* CV Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pilih Tipe CV</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cvTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    selectedType === type.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  } ${type.popular ? 'border-yellow-400 relative' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                      Terpopuler
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(type.price)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
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
              <h4 className="font-semibold mb-2">Proses Pembayaran:</h4>
              <ul className="text-sm space-y-1 text-blue-800">
                <li>• Klik "Beli Sekarang" untuk membuat pesanan</li>
                <li>• Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>• Hubungi WhatsApp 081991191988 dengan bukti pembayaran</li>
                <li>• Admin akan memverifikasi dan mengirim CV Anda</li>
                <li>• CV siap dalam 1-3 hari kerja setelah verifikasi</li>
              </ul>
            </CardContent>
          </Card>

          <Button onClick={handlePurchase} className="w-full" size="lg">
            <Star className="h-4 w-4 mr-2" />
            Beli Sekarang - {formatPrice(cvTypes.find(t => t.id === selectedType)?.price || 0)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPurchaseDialog;
