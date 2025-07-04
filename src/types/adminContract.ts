export interface AdminContract {
  id: string;
  user_id: string;
  contract_type: string;
  price: number;
  payment_status: string;
  payment_method?: string;
  whatsapp_number?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface ContractResponse {
  success: boolean;
  error?: string;
  contract?: any;
}