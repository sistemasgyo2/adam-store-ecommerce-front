import type { BillingInfo, DeliveryInfo } from "./checkout";
import type { Option, Price } from "./product";

export interface Cart {
    id: string;
    currency: string;
    lines: ProductCart[];
    totals: CartTotal
    subtotal: Price;
    delivery_info?: DeliveryInfo,
    billing_info?: BillingInfo,
}

export interface StoreCart {
    id: number;
    name: string;
}

export interface ProductCart {
    id: number;
    code: string;
    name: string;
    image: string;
    is_available: boolean;
    quantity: number;
    price: Price;
    options: Option[];
    subtotal: Price;
}

export interface CartTotal {
    items_total: Price;
    subtotal: Price;
    shipping: Price;
    taxes: Price;
    total: Price;
}