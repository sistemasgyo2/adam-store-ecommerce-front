<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl font-bold text-gray-900">Revisa y Confirma los datos</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="space-y-2 mb-8 text-gray-600">
        <div>
          <p class="font-medium">Quien recoge en tienda es:</p>
          <p>{{ deliveryInfo.name }}</p>
          <p>Documento: {{ deliveryInfo.document_number }}</p>
          <p>Tel: {{ deliveryInfo.phone }}</p>
        </div>
        <Separator />
        <div v-if="deliveryInfo.method == 'pickup'">
          <p class="font-medium">{{ deliveryInfo.store?.name }}</p>
          <p>Dirección: {{ deliveryInfo.store?.address }}</p>
          <p>{{ deliveryInfo.store?.district?.name }}</p>
          <p>{{ deliveryInfo.store?.availability }}</p>
        </div>
        <div v-if="deliveryInfo.method == 'delivery'">
          <p class="font-medium">Lugar de entrega</p>
          <p>Dirección: {{ deliveryInfo.address }}</p>
          <p>{{ deliveryInfo.department?.name }} - {{ deliveryInfo.district?.name }}</p>
          <p>{{ deliveryInfo.delivery_option?.availability }}</p>
        </div>
        <Separator />
        <div>
          <p class="font-medium">Datos de Facturación:</p>
          <p>{{ billingInfo.type.toUpperCase() }}</p>
          <p>{{ billingInfo.business_name }}</p>
          <p>{{ billingInfo.document_type.toUpperCase() }}: {{ billingInfo.document_number }}</p>
          <p>{{ billingInfo.email }}</p>
          <p>{{ billingInfo.phone }}</p>
        </div>
      </div>

      <div class="flex items-start justify-between mb-8">
        <div class="flex items-center space-x-3">
          <Checkbox id="terms" v-model="acceptTerms" />
          <Label class="text-sm text-gray-800 font-normal leading-relaxed">
            He leído y estoy de acuerdo con los
            <span @click="showTermsDialog = true"
              class="font-semibold text-primary cursor-pointer underline underline-offset-4">
              términos y condiciones de la web
            </span>
          </Label>
        </div>
        <Button variant="ghost" @click="onEditDeliveryInfo" class="font-medium">
          <Edit class="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      <div class="flex items-center justify-center gap-4">
        <div v-if="enableTransfer" @click="onPaymentTypeSelected('transfer')"
          class="flex items-center justify-center cursor-pointer">
          <img src="~/assets/images/bank_transfer.png" alt="Pagaré con transferencia" class="w-72 h-auto" />
        </div>
        <div v-if="enableCardWallet" @click="onPaymentTypeSelected('card')"
          class="flex items-center justify-center cursor-pointer">
          <img src="~/assets/images/card_wallet.png" alt="Pagaré con transferencia" class="w-72 h-auto" />
        </div>
      </div>
    </CardContent>
  </Card>
  <Dialog v-model:open="showTermsDialog">
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          Última actualización: {{ lastUpdated }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 overflow-y-auto">
        <div v-html="content" class="prose prose-gray max-w-none dark:prose-invert"></div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline">
            Cerrar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import type { BillingInfo, DeliveryInfo } from '@/types/checkout';
import { Edit } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import type { Page } from '@/types/pages';

const { deliveryInfo, billingInfo, enableTransfer, enableCardWallet } = defineProps<{
  deliveryInfo: DeliveryInfo,
  billingInfo: BillingInfo,
  enableTransfer: boolean,
  enableCardWallet: boolean,
}>();

const emit = defineEmits(['updateCurrentStep', 'paymentType']);

const sanctumFetch = useSanctumClient();

const acceptTerms: Ref<boolean> = ref<boolean>(false);
const showTermsDialog: Ref<boolean> = ref<boolean>(false);

const dataPage = await sanctumFetch<Page>(`/api/pages/terminos-condiciones`);

const title = ref(dataPage.title);
const content = ref(dataPage.content);
const lastUpdated = ref(dataPage.last_updated);

const onEditDeliveryInfo = () => {
  emit('updateCurrentStep', 'shipping_info');
}

const onPaymentTypeSelected = (type: 'transfer' | 'card') => {
  if (!acceptTerms.value) {
    return;
  }
  emit('paymentType', type)
}
</script>

<style></style>