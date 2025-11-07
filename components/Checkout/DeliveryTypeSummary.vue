<template>
  <Card>
    <CardContent class="px-6">
      <div class="flex items-start justify-between">
        <div class="flex justify-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
          <div class="space-y-1">
            <p class="font-medium text-gray-900">{{ deliveryInfo.method == 'pickup' ? 'Retiro en Tienda' : 'Delivery' }}</p>
            <p class="text-sm text-gray-600">Nombre: {{
              deliveryInfo.name }}</p>
            <p class="text-sm text-gray-600">{{ deliveryInfo.document_type.toUpperCase() }}: {{
              deliveryInfo.document_number }}</p>
            <p class="text-sm text-gray-600">Tel: {{ deliveryInfo.phone }}</p>
            <p v-if="deliveryInfo.method === 'delivery'" class="text-sm text-gray-600">
              Dirección: {{ deliveryInfo.address }}, {{ deliveryInfo.district?.name }}, {{ deliveryInfo.province?.name }},
              {{ deliveryInfo.department?.name }}
            </p>
            <p v-if="deliveryInfo.method === 'pickup'" class="text-sm text-gray-600">
              {{ deliveryInfo.store?.name }}
              {{ deliveryInfo.store?.address }}
              {{ deliveryInfo.store?.schedule }}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" @click="editDeliveryInfo">
          <Edit class="w-4 h-4 mr-1" />
          Editar
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import type { DeliveryInfo } from '@/types/checkout';
import { Card, CardContent } from '../ui/card';
import { Edit } from 'lucide-vue-next';

const { deliveryInfo } = defineProps<{
  deliveryInfo: DeliveryInfo,
}>();

const emit = defineEmits(['updateCurrentStep']);

const editDeliveryInfo = () => {
  emit('updateCurrentStep', 'shipping_info');
}
</script>

<style></style>