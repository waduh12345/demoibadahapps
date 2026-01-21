export interface CheckoutTransactionDetail {
  store_product_id: number;
  quantity: number;
}

export interface CheckoutTransactionData {
  store_id: number;
  details: CheckoutTransactionDetail[];
}

export interface CheckoutTransactionRequest {
  user_id?: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  notes?: string;
  payment_method: "automatic" | "manual";
  gateway_type?: "bank_transfer" | "qris";
  gateway_bank?: "bca" | "bni" | "bri" | "cimb" | "qris";
  data: CheckoutTransactionData[];
}

export interface TransactionPayment {
  id: number;
  driver: string;
  payable_type: string;
  payable_id: number;
  order_id: string;
  transaction_id: string;
  payment_type: "qris" | "bank_transfer";
  account_number: string;
  account_code: string | null;
  channel: string;
  expired_at: string;
  paid_at: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: string | null;
  reference: string;
  ref_number: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  notes: string;
  payment_method: "automatic" | "manual";
  amount: string;
  total_amount: string;
  status: number;
  created_at: string;
  updated_at: string;
  payment: TransactionPayment;
}

export interface CheckoutTransactionResponse {
  code: number;
  message: string;
  data: Transaction;
}
