export interface Option {
    option: string;
    value: string;
}

export interface ProductItem {
    id: string;
    slug: string;
    name: string;
    prices: Prices;
    brand: ProductItemBrand;
    image: string;
    is_new: boolean;
    has_discount: boolean;
}

export interface ProductItemBrand {
    name: string;
    slug: string;
}

export interface Prices {
    currency: string;
    price: Price;
    alt_price: Price;
}

export interface Price {
    amount: null | number;
    decimal: null | number;
    formatted: null | string;
}

export interface ProductAttribute {
    name: string;
    value: string;
}

export interface ProductSearch {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    image: string;
}