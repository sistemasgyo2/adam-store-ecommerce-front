<template>
  <Card>
    <CardContent class="px-6">
      <div class="flex items-start justify-between">
        <div class="flex justify-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
          <div class="space-y-1">
            <p class="font-medium text-gray-900">{{ billingInfo.type.toUpperCase() }}</p>
            <p class="text-sm text-gray-600">{{ billingInfo.document_type.toUpperCase() }}: {{
              billingInfo.document_number }}</p>
            <p class="text-sm text-gray-600">{{ billingInfo.business_name }}</p>
            <p class="text-sm text-gray-600">
              Télefono: {{ billingInfo.phone }}
            </p>
            <p class="text-sm text-gray-600">
              Correo: {{ billingInfo.email }}
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
import type { BillingInfo } from '@/types/checkout';
import { Card, CardContent } from '../ui/card';
import { Edit } from 'lucide-vue-next';

const { billingInfo } = defineProps<{
  billingInfo: BillingInfo,
}>();

const emit = defineEmits(['updateCurrentStep']);

const editDeliveryInfo = () => {
  emit('updateCurrentStep', 'billing_info');
}
</script>

<style>

</style>