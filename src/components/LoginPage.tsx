
import React, { useState } from 'react';
import { Ship, Waves, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app, you'd authenticate with backend
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with maritime theme */}
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

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-slate-600">
              Akses dashboard navigasi kapal Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              >
                <LogIn className="h-4 w-4 mr-2" />
                Masuk
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                Demo: Masukkan email dan password apa saja untuk masuk
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

export default LoginPage;
