
import React, { useState } from 'react';
import { Ship, Waves, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Nama lengkap diperlukan untuk mendaftar",
            variant: "destructive",
          });
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Error Mendaftar",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Berhasil Mendaftar",
            description: "Akun Anda telah dibuat. Silakan masuk.",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error Masuk",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Ship className="h-12 w-12 text-blue-600 mr-2" />
              <Waves className="h-6 w-6 text-blue-400 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">NaviMarine</h1>
          <p className="text-slate-600">Sistem Navigasi & Monitoring Kapal</p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800">
              {isSignUp ? 'Daftar Akun Baru' : 'Masuk ke Sistem'}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {isSignUp 
                ? 'Buat akun untuk menggunakan sistem navigasi' 
                : 'Akses dashboard navigasi kapal Anda'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <Input
                    type="text"
                    placeholder="Kapten Ahok"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="captain@navimarine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-6"
                disabled={loading}
              >
                {loading ? (
                  'Loading...'
                ) : isSignUp ? (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Daftar
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {isSignUp 
                  ? 'Sudah punya akun? Masuk di sini' 
                  : 'Belum punya akun? Daftar di sini'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Decorative waves */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-blue-300">
            <Waves className="h-4 w-4 mr-1" />
            <Waves className="h-4 w-4 mr-1" />
            <Waves className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
