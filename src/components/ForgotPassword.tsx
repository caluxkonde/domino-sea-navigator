
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Key, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Masukkan alamat email Anda",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email Terkirim",
          description: "Silakan cek email Anda untuk link reset password",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl text-slate-800">Email Terkirim!</CardTitle>
          <CardDescription>
            Kami telah mengirim link untuk reset password ke email Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              Silakan cek inbox email Anda dan klik link yang diberikan untuk mengatur ulang password.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Tidak menerima email? Cek folder spam atau
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              Kirim Ulang
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Key className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-xl text-slate-800">Lupa Password?</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk mendapatkan link reset password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengirim...
              </div>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Kirim Link Reset
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Kembali ke Login
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Catatan:</strong> Link reset password akan kadaluarsa dalam 1 jam. 
            Jika tidak menerima email, periksa folder spam Anda.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
