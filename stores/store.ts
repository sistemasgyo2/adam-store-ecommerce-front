import type { Store } from '@/types/checkout';
import { defineStore } from 'pinia'

export const useStoreStore = defineStore('store', () => {
  const sanctumFetch = useSanctumClient();

  const stores: Ref<Store[]> = ref<Store[]>([]);

  const fetchStore = async () => {
    const response = await sanctumFetch<Store[]>('/stores/get', {
      method: 'GET',
    });

    stores.value = response;
  };

  const getStores = async () => {
    if (stores.value.length === 0) {
      await fetchStore();
    }

    return stores.value;
  }


  return {
    getStores,
  };
})
