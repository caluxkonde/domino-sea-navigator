
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { contractService } from '@/services/contractService';
import { parseContractResponse, isContractActionSuccessful } from '@/utils/contractResponseHandler';
import { AdminContract } from '@/types/adminContract';

export type { AdminContract } from '@/types/adminContract';

export const useAdminContracts = () => {
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPendingContracts = async () => {
    try {
      const contractsData = await contractService.fetchPendingContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kontrak",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptContract = async (contractId: string, adminNotes?: string) => {
    if (!user) return false;

    try {
      const data = await contractService.acceptContract(contractId, user.id, adminNotes);
      const response = parseContractResponse(data);

      if (isContractActionSuccessful(response)) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah disetujui",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error accepting contract:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyetujui kontrak",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectContract = async (contractId: string, adminNotes?: string) => {
    if (!user) return false;

    try {
      const data = await contractService.rejectContract(contractId, user.id, adminNotes);
      const response = parseContractResponse(data);

      if (isContractActionSuccessful(response)) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah ditolak",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error rejecting contract:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menolak kontrak",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelContract = async (contractId: string, cancellationReason?: string) => {
    if (!user) return false;

    try {
      const data = await contractService.cancelContract(contractId, user.id, cancellationReason);
      const response = parseContractResponse(data);

      if (isContractActionSuccessful(response)) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah dibatalkan",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error cancelling contract:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal membatalkan kontrak",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPendingContracts();
  }, [user]);

  return {
    contracts,
    loading,
    acceptContract,
    rejectContract,
    cancelContract,
    refetch: fetchPendingContracts
  };
};
