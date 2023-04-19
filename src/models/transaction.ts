export interface Transaction {
  id?: number;
  subtotal?: number;
  tax?: number;
  transaction_status?: string;
  total?: number;
  discount?: number;
  tax_percentage?: number;
  user?: any;
  payment_method?: string;
  payment_reference?: string;
  payment_response?: string;
  details?: string;
}
export interface Transaction_details {
  id?: number;
  transaction?: number;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
  product?: any;
  type?: string;
}
