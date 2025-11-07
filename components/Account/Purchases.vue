<template>
  <div v-if="!loading" class="rounded-lg border overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Fecha</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipo de Doc</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Num</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Total</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipo de Entrega</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Forma de Pago</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Estado de Pago</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Estado de Pedido</th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">PDF</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="orders.length > 0" v-for="order in orders" class="hover:bg-gray-50">
            <td class="px-4 py-4 text-sm text-gray-900">{{ order.date }}</td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ order.document_type.toUpperCase() }}</td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ order.document_number }}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-900">{{ order.total.formatted }}</td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ order.shipping_method }}</td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ order.payment_method }}</td>
            <td class="px-4 py-4">
              <Badge class="ring text-xs font-medium px-1.5 py-0.5 rounded-md"
                :class="{ 'bg-yellow-50 text-yellow-600 ring-yellow-300': order.payment_status == 'pending', 'bg-green-50 text-green-600 ring-green-500': order.payment_status == 'verified' }">
                {{ order.payment_status == 'pending' ? 'Pendiente' : 'Verificado' }}
              </Badge>
            </td>
            <td class="px-4 py-4">
              <Badge variant="secondary" class="ring text-xs font-medium px-1.5 py-0.5 rounded-md"
                :class="{ 'bg-indigo-50 text-indigo-600 ring-indigo-500': order.status == 'pending', 'bg-green-50 text-green-600 ring-green-500': order.status == 'delivered' }">
                {{ order.status == 'pending' ? 'No Entregado' : 'Entregado' }}
              </Badge>
            </td>
            <td class="px-4 py-4 text-center">
              <Button v-if="order.pdf" size="sm" variant="destructive" as-child>
                <a :href="order.pdf" target="_blank">PDF</a>
              </Button>
              <span v-else>-</span>
            </td>
          </tr>
          <tr v-else>
            <td colspan="9" class="text-center font-medium">No se encontraron érdenes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="flex items-center justify-center">
    <Loader2 class="size-7 animate-spin text-primary" />
  </div>
</template>

<script lang="ts" setup>
import type { UserOrder } from '@/types/user';
import Badge from '../ui/badge/Badge.vue';
import { Loader2 } from 'lucide-vue-next';

const orders: Ref<UserOrder[]> = ref<UserOrder[]>([]);
const loading: Ref<boolean> = ref<boolean>(true);

const sanctumFetch = useSanctumClient();

const getOrders = async () => {
  const response = await sanctumFetch<UserOrder[]>('/account/orders');

  orders.value = response;

  loading.value = false;
}

onMounted(() => {
  getOrders();
});
</script>

<style></style>