import type { CompanyData, Footer, Layout, MenuItem, Settings } from '@/types/layout';
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const items: Ref<MenuItem[]> = ref<MenuItem[]>([]);
  const footer: Ref<Footer | null> = ref<Footer | null>(null);
  const companyData: Ref<CompanyData | null> = ref<CompanyData | null>(null);
  const settings: Ref<Settings | null> = ref<Settings | null>(null);

  const setItems = (data?: MenuItem[]) => (items.value = data ?? []);
  const setFooter = (data?: Footer) => (footer.value = data ?? null);
  const setCompanyData = (data?: CompanyData) => (companyData.value = data ?? null);
  const setSettings = (data?: Settings) => (settings.value = data ?? null);

  const fetchMenu = async () => {
    try {
      const { data } = await useSanctumFetch<Layout>('/api/layout');
      setItems(data.value.menu);
      setFooter(data.value.footer);
      setCompanyData(data.value.company_data);
      setSettings(data.value.settings);
    } catch (err) {
    }
  };

  return {
    items,
    footer,
    companyData,
    settings,
    fetchMenu,
    setItems
  };
});
