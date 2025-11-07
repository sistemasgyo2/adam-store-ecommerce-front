import type { OrderData } from '@/types/checkout'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null as OrderData | null,
  }),
  actions: {
    setOrder(order: OrderData) {
      this.order = order
    }
  }
})
