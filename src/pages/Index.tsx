import { AuthProvider } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import { AppLayout } from '@/components/Layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Memuat Info Pelaut</h2>
          <p className="text-slate-600">Menyiapkan sistem navigasi maritim...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppLayout onAuthRequired={() => {}} />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
