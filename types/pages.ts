import type { Prices, ProductAttribute, ProductItem } from "./product";

export interface PageResponse {
    title: string;
    filters: Filters;
    data: ProductItem[];
}

export interface Filters {
    attributes: Attribute[];
    options: ProductOption[];
}

export interface BrandElement {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}


export interface HomePage {
    slides: Slide[];
    subSlides: Slide[];
    brands: Brand[];
    categories: Category[];
}

export interface Slide {
    name: string;
    responsive_image: string;
    image: string;
}

export interface Brand {
    name: string;
    image: string;
}

export interface Category {
    slug: string;
    image: string;
    name: string;
}

export interface Product {
    name: string;
    description: string;
    compatibility: string;
    warranty: string;
    images_thumb: string[];
    images: string[];
    brand: Brand;
    category: Brand;
    product_options: ProductOption[];
    has_variants: boolean;
    variant: Variant;
    variants: Variant[] | null;
    attributes: ProductAttribute[]
}

export interface Brand {
    name: string;
    slug: string;
}

export interface Variant {
    id: number;
    code: string;
    stock_available: boolean;
    current_stock: number;
    prices: Prices;
    values: VariantValue[];
}

export interface ProductOption {
    id: number;
    name: string;
    values: ProductOptionValue[];
}

export interface ProductOptionValue {
    name: string;
    id: number;
}

export interface VariantValue {
    id: number;
    name: string;
    option_id: number;
}

export interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}

export interface AttributeValue {
    id: number;
    value: string;
}

export interface Page {
    title: string;
    content: string;
    last_updated: string;
}

export interface ConsultDocumentResponse {
    valid: boolean;
    name: string | null;
    error: string | null;
}