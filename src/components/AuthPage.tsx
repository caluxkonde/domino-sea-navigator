
import React, { useState } from 'react';
import { Ship, Waves, LogIn, UserPlus, Calendar, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ForgotPassword from './ForgotPassword';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Error Masuk",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fullName.trim()) {
        toast({
          title: "Error",
          description: "Nama lengkap diperlukan untuk mendaftar",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      if (!dateOfBirth) {
        toast({
          title: "Error", 
          description: "Tanggal lahir diperlukan untuk mendaftar",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const { error } = await signUp(email, password, fullName, dateOfBirth);
      if (error) {
        toast({
          title: "Error Mendaftar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Berhasil Mendaftar",
          description: "Akun Anda telah dibuat. Silakan periksa email untuk verifikasi.",
        });
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
        setDateOfBirth('');
        setPhone('');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setDateOfBirth('');
    setPhone('');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Ship className="h-12 w-12 text-blue-600 mr-2" />
              <Waves className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">NaviMarine</h1>
          </div>
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

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
              Akses Sistem
            </CardTitle>
            <CardDescription className="text-slate-600">
              Masuk atau daftar untuk menggunakan platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" onClick={resetForm}>Masuk</TabsTrigger>
                <TabsTrigger value="signup" onClick={resetForm}>Daftar</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
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

                  <div className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    >
                      <Key className="h-3 w-3 mr-1" />
                      Lupa Password?
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Masuk...
                      </div>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Masuk
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                        required
                      />
                      <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nomor WhatsApp (Opsional)</label>
                    <Input
                      type="tel"
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  
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
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mendaftar...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Daftar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Admin Login Info */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Admin:</strong> Untuk akses admin, gunakan email admin yang terdaftar. 
                Sistem akan otomatis mendeteksi role pengguna.
              </p>
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
