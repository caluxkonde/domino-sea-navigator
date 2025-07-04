import { ContractResponse } from '@/types/adminContract';

export const parseContractResponse = (data: any): ContractResponse => {
  // Handle the response - it could be a JSON object or string
  let response: ContractResponse;
  
  if (typeof data === 'string') {
    try {
      response = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse response:', data);
      // If we can't parse, assume success if no error from RPC
      response = { success: true };
    }
  } else if (typeof data === 'object' && data !== null) {
    response = data as unknown as ContractResponse;
  } else {
    // Assume success if no error
    response = { success: true };
  }

  return response;
};

export const isContractActionSuccessful = (response: ContractResponse): boolean => {
  return response.success !== false;
};