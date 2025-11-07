import type { Price } from "./product";
import type { Customer } from "./user";

export interface DeliveryInfo {
  method: "pickup" | "delivery",
  department: UbigeoItem | null;
  province: UbigeoItem | null;
  district: UbigeoItem | null;
  address?: string;
  store?: Store;
  delivery_option?: DeliveryOption;
  document_type: "carnet_extranjeria" | "dni",
  document_number: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface UbigeoItem {
  id: number;
  name: string;
}

export interface Store {
  id: number;
  name: string;
  phone: string | null;
  address: string;
  schedule: string | null;
  district: UbigeoItem,
  department: UbigeoItem,
  availability: string | null,
}

export interface DeliveryOption {
  id: number;
  name: string;
  fee: Price;
  availability: string | null;
}

export interface BillingInfo {
  type: "boleta" | "factura";
  document_type: "dni" | "ce" | "ruc";
  document_number: string;
  business_name: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  notes?: string
}

export interface PaymentInfo {
  method: "transfer" | "card"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardName?: string
  transferReference?: string
}

export interface BankAccount {
  account_type: string;
  bank_name: string;
  account_number: string;
  cci: string;
}

export interface OrderData {
  uuid: string;
  number: string;
  customer: Customer;
  shipping_info: OrderDataShipping;
  payment_info: OrderDataPayment;
  totals: {
    shipping_total: Price;
    sub_total: Price;
    tax_total: Price;
    total: Price;
  }
}

export interface OrderDataShipping {
  method: string;
  address: string;
  shipping_option: string;
  district: string;
}

export interface OrderDataPayment {
  type: string;
  type_label: string;
}