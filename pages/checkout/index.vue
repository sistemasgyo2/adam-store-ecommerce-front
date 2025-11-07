<template>
  <div>
    <PaymentLoading v-if="isLoadingPayment" />
    <LayoutAppContainer class="py-6">
      <div class="flex flex-col justify-center gap-4 mb-8">
        <NuxtLink to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Continuar Comprando
          </Button>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">
          Finalizar Compra
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <Alert v-if="generalError" variant="destructive">
            <XCircle class="h-4 w-4" />
            <AlertDescription>{{ generalError }}</AlertDescription>
          </Alert>
          <CheckoutSectionSkeleton v-if="isLoadingData" />
          <CheckoutDeliveryType v-if="!isLoadingData && currentStep == 'shipping_info'" :delivery-info="deliveryInfo"
            :allow-delivery="settingsAvailable.delivery" :allow-pickup="settingsAvailable.pick_up_in_store"
            :cart-id="cartId" @updateCurrentStep="onUpdateCurrentStep" @update-cart-data="onUpdateCartData" />
          <CheckoutBillingInfo v-if="!isLoadingData && currentStep == 'billing_info'" :billing-info="billingInfo"
            :cart-id="cartId" @updateCurrentStep="onUpdateCurrentStep" />
          <CheckoutBillingInfoSummary
            v-if="!isLoadingData && currentStep != 'billing_info' && billingInfo.document_number && currentStep != 'order_summary'"
            :billing-info="billingInfo" @updateCurrentStep="onUpdateCurrentStep" />
          <CheckoutOrderSummary v-if="!isLoadingData && currentStep == 'order_summary'"
            :enable-transfer="settingsAvailable.enable_bank_transfer"
            :enable-card-wallet="settingsAvailable.enable_card_wallet" :delivery-info="deliveryInfo"
            :billing-info="billingInfo" @updateCurrentStep="onUpdateCurrentStep" @paymentType="onPaymentType" />
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Compra</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div v-if="isLoadingData" class="flex items-center justify-center">
                  <Loader2 class="size-7 animate-spin text-primary" />
                </div>
                <div v-else="isLoadingData" class="space-y-3">
                  <div v-for="item in cartItems" :key="item.id" class="flex gap-3">
                    <div class="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="object-contain p-2">
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-sm text-gray-900 line-clamp-2">{{ item.name }}</h4>
                      <p v-if="item.options.length > 0" class="text-xs text-gray-500 flex gap-2">
                        <span v-for="option in item.options">
                          {{ option.option }}: {{ option.value }}
                        </span>
                      </p>
                      <div class="flex justify-between items-center mt-1">
                        <span class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</span>
                        <span class="font-medium">{{ item.subtotal.formatted }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Subtotal</span>

                    <span>{{ cartStore.totals.items_total.formatted }}</span>
                  </div>
                  <div v-if="cartStore.deliveryInfo && !isLoadingTotalsData" class="flex justify-between items-center">
                    <div class="grid">
                      <span class="text-gray-600">Envío</span>
                      <span class="text-sm text-gray-500 italic" v-if="cartStore.deliveryInfo.method == 'pickup'">
                        Retiro en Tienda - {{ cartStore.deliveryInfo.store?.name }}
                      </span>
                      <span class="text-sm text-gray-500 italic" v-if="cartStore.deliveryInfo.method == 'delivery'">
                        {{ cartStore.deliveryInfo.delivery_option?.name }}
                      </span>
                    </div>

                    <span class="text-green-600">
                      {{ cartStore.totals.shipping.formatted }}
                    </span>
                  </div>
                  <div v-if="isLoadingTotalsData" class="flex items-center justify-center">
                    <Loader2 class="size-7 animate-spin text-primary" />
                  </div>
                  <Separator />
                  <div class="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span class="text-primary">
                      {{ cartStore.totals.total.formatted }}
                    </span>
                  </div>
                </div>

                <div class="text-center text-xs text-gray-500 pt-4 border-t">
                  <div class="flex items-center justify-center gap-1 mb-1">
                    <Lock class="w-3 h-3" />
                    <span>Compra 100% segura</span>
                  </div>
                  <p>Protegido con encriptación SSL</p>
                </div>
              </CardContent>
            </Card>
            <CheckoutDeliveryTypeSummary v-if="!isLoadingData && currentStep != 'shipping_info'"
              :deliveryInfo="deliveryInfo" @updateCurrentStep="onUpdateCurrentStep" />
          </div>
        </div>
      </div>
      <CheckoutPaymentTransferDialog v-model="showPaymentTransferDialog" />
    </LayoutAppContainer>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Loader2, Lock, XCircle } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BillingInfo, DeliveryInfo, OrderData } from '@/types/checkout';
import type { ProductCart } from '@/types/cart';
import type { Settings } from '@/types/layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

useHead({
  title: 'Finalizar Compra',
});

const isLoadingData: Ref<boolean> = ref<boolean>(true);
const isLoadingPayment: Ref<boolean> = ref<boolean>(false);
const isLoadingTotalsData: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);
const cartItems: Ref<ProductCart[]> = ref<ProductCart[]>([]);
const cartId: Ref<string> = ref<string>('');
const settingsAvailable = reactive<Settings>({
  delivery: true,
  pick_up_in_store: true,
  enable_bank_transfer: true,
  enable_card_wallet: true,
});

const showPaymentTransferDialog: Ref<boolean> = ref<boolean>(false);

const cartStore = useCartStore();
const { settings } = useLayoutStore();
const sanctumFetch = useSanctumClient();
const orderStore = useOrderStore()

const steps = [
  'shipping_info',
  'billing_info',
  'order_summary'
];

const currentStep: Ref<string> = ref<string>('shipping_info');

const deliveryInfo = reactive<DeliveryInfo>({
  method: 'pickup',
  department: null,
  province: null,
  district: null,
  document_type: 'dni',
  document_number: '',
  name: '',
  phone: '',
  notes: '',
});

const billingInfo = reactive<BillingInfo>({
  type: "boleta",
  document_type: "dni",
  document_number: '',
  business_name: '',
  email: '',
  phone: '',
})

const prepareData = async () => {
  await cartStore.getCart()
  cartItems.value = cartStore.items;
  isLoadingData.value = false;
  cartId.value = cartStore.id ?? '';

  if (cartStore.deliveryInfo) {
    Object.assign(deliveryInfo, cartStore.deliveryInfo);
  }

  if (cartStore.billingInfo) {
    Object.assign(billingInfo, cartStore.billingInfo);
  }

  if (!cartStore.deliveryInfo?.document_number) {
    currentStep.value = 'shipping_info'
  } else if (!cartStore.billingInfo?.document_number) {
    currentStep.value = 'billing_info'
  } else {
    currentStep.value = 'order_summary';
  }
}

const onUpdateCurrentStep = (newStep: string) => {
  currentStep.value = newStep;
}

const onUpdateCartData = async () => {
  isLoadingTotalsData.value = true;
  await cartStore.getCart();
  isLoadingTotalsData.value = false;
}

const onPaymentType = (type: 'transfer' | 'card') => {
  if (type == 'transfer') {
    showPaymentTransferDialog.value = true;
  } else if (type == 'card') {
    showCulqiDialog()
  }
}

const showCulqiDialog = () => {
  // Configura las opciones del checkout
  Culqi.settings({
    title: 'Portatiles y Redes',
    currency: cartStore.currency,
    description: 'Descripcion',
    amount: cartStore.totals.total.amount
  });

  // Abre el checkout de Culqi
  Culqi.open();
}

const handleCardPayment = async (token: string) => {
  isLoadingPayment.value = true;
  try {
    const response = await sanctumFetch<OrderData>(`/checkout/${cartStore.id}/process`, {
      method: 'post',
      body: {
        type: 'card',
        token: token,
      }
    });

    orderStore.setOrder(response);

    navigateTo('payment-success');
  }
  catch (error) {
    const err = useSanctumError(error);

    if (!err.isValidationError) {
      generalError.value = err.generalMessage
    }
  }
  finally {
    isLoadingPayment.value = false;
  }
}

onMounted(() => {
  prepareData();

  settingsAvailable.delivery = settings?.delivery ?? true;
  settingsAvailable.pick_up_in_store = settings?.pick_up_in_store ?? true;
  settingsAvailable.enable_bank_transfer = settings?.enable_bank_transfer ?? true;
  settingsAvailable.enable_card_wallet = settings?.enable_card_wallet ?? true;

  window.culqi = () => {
    if (Culqi.token) {
      handleCardPayment(Culqi.token.id);
      window.Culqi.close();
    } else {
      console.log("Error : ", Culqi.error);
      window.Culqi.close();
    }
  }
})

</script>

<style></style>