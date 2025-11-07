import type { Price } from "./product"

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
}

export interface Customer {
  document_type?: 'dni' | "ruc" | "ce";
  document_number?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  other_contact?: string;
  email?: string;
}

export interface UserOrder {
  date: string;
  document_type: string;
  document_number: string;
  total: Price;
  shipping_method: string;
  payment_method: string;
  payment_status: string;
  status: string;
  pdf: string | null;
}