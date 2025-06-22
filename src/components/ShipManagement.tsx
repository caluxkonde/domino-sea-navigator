
import React, { useState } from 'react';
import { Ship, Plus, Edit, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShips } from '@/hooks/useShips';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ShipManagement = () => {
  const { ships, loading, addShip } = useShips();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    imo_number: '',
    call_sign: '',
    flag: '',
    length_m: '',
    width_m: '',
    draft_m: '',
    gross_tonnage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const shipData = {
      ...formData,
      length_m: formData.length_m ? parseFloat(formData.length_m) : undefined,
      width_m: formData.width_m ? parseFloat(formData.width_m) : undefined,
      draft_m: formData.draft_m ? parseFloat(formData.draft_m) : undefined,
      gross_tonnage: formData.gross_tonnage ? parseFloat(formData.gross_tonnage) : undefined,
    };

    const result = await addShip(shipData);
    if (result) {
      toast({
        title: "Berhasil",
        description: "Kapal berhasil ditambahkan",
      });
      setIsOpen(false);
      setFormData({
        name: '', type: '', imo_number: '', call_sign: '', flag: '',
        length_m: '', width_m: '', draft_m: '', gross_tonnage: '',
      });
    } else {
      toast({
        title: "Error",
        description: "Gagal menambahkan kapal",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading ships...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Kapal</h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kapal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Kapal Baru</DialogTitle>
              <DialogDescription>
                Masukkan detail kapal yang akan ditambahkan ke sistem
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kapal *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="MV Ocean Explorer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Kapal</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="Container Ship"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imo_number">Nomor IMO</Label>
                  <Input
                    id="imo_number"
                    value={formData.imo_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, imo_number: e.target.value }))}
                    placeholder="1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call_sign">Call Sign</Label>
                  <Input
                    id="call_sign"
                    value={formData.call_sign}
                    onChange={(e) => setFormData(prev => ({ ...prev, call_sign: e.target.value }))}
                    placeholder="ABCD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag">Bendera</Label>
                  <Input
                    id="flag"
                    value={formData.flag}
                    onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                    placeholder="Indonesia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length_m">Panjang (m)</Label>
                  <Input
                    id="length_m"
                    type="number"
                    value={formData.length_m}
                    onChange={(e) => setFormData(prev => ({ ...prev, length_m: e.target.value }))}
                    placeholder="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width_m">Lebar (m)</Label>
                  <Input
                    id="width_m"
                    type="number"
                    value={formData.width_m}
                    onChange={(e) => setFormData(prev => ({ ...prev, width_m: e.target.value }))}
                    placeholder="32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_tonnage">Gross Tonnage</Label>
                  <Input
                    id="gross_tonnage"
                    type="number"
                    value={formData.gross_tonnage}
                    onChange={(e) => setFormData(prev => ({ ...prev, gross_tonnage: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Tambah Kapal
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ships.map((ship) => (
          <Card key={ship.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ship className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg text-slate-800">{ship.name}</CardTitle>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  ship.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ship.status}
                </div>
              </div>
              <CardDescription className="text-slate-600">
                {ship.type || 'Jenis tidak ditentukan'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {ship.current_lat && ship.current_lng && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-600">
                    {ship.current_lat.toFixed(4)}, {ship.current_lng.toFixed(4)}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-600 text-xs">Kecepatan</p>
                  <p className="font-semibold text-blue-800">{ship.current_speed} knots</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-600 text-xs">Heading</p>
                  <p className="font-semibold text-blue-800">{ship.current_heading}°</p>
                </div>
              </div>

              {ship.call_sign && (
                <div className="text-xs text-slate-600">
                  Call Sign: {ship.call_sign}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {ships.length === 0 && (
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Ship className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Belum Ada Kapal</h3>
              <p className="text-slate-500 mb-4">Tambahkan kapal pertama Anda untuk memulai</p>
              <Button 
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kapal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShipManagement;
