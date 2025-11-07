export interface Layout {
    menu:   MenuItem[];
    footer: Footer;
    company_data: CompanyData;
    settings: Settings;
}
export interface MenuItem {
    name: string
    slug: string
    children: MenuItem[]
}

export interface Footer {
    data:   Data;
    social: Social[];
}

export interface Data {
    phone:    string;
    email:    string;
    schedule: string;
    address:  string;
}

export interface Social {
    platform: string;
    url:      string;
}

export interface CompanyData {
    ruc: string;
    business_name: string;
    trade_name: string;
    phone: string;
    address: string;
}

export interface Settings {
    enable_bank_transfer: boolean;
    enable_card_wallet: boolean;
    pick_up_in_store: boolean;
    delivery: boolean;
}