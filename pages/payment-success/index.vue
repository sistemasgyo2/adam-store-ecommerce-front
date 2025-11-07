<template>
  <div class="bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div
            class="bg-green-500 rounded-2xl p-8 lg:p-12 text-white text-center min-h-[500px] flex flex-col justify-center relative overflow-hidden h-full">
            <div class="mb-6">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle class="w-12 h-12 text-green-500" />
              </div>

              <h1 class="text-2xl lg:text-3xl font-bold mb-4">¡Muchas Gracias!</h1>
              <h2 class="text-xl lg:text-2xl font-semibold mb-6">TU PEDIDO HA SIDO RECIBIDO</h2>

              <p class="text-lg mb-8 opacity-90">
                Te enviaremos un correo electrónico con los detalles de tu compra.
              </p>

              <div class="text-2xl lg:text-3xl font-bold">{{ order?.customer.email }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">PEDIDO</h3>
              <div class="text-2xl font-bold text-gray-900"># {{ order?.number }}</div>
            </div>
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <User class="w-5 h-5 text-orange-500" />
                <h4 class="font-bold text-gray-900">FACTURADO A:</h4>
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="font-medium text-gray-900">{{ order?.customer.business_name }}</div>
                <div>{{ order?.customer.document_type?.toUpperCase() }}: {{ order?.customer.document_number }}</div>
                <div>{{ order?.customer.business_phone }}</div>
                <div>{{ order?.customer.email }}</div>
              </div>
            </div>
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <CreditCard class="w-5 h-5 text-orange-500" />
                <h4 class="font-bold text-gray-900">MÉTODO DE PAGO</h4>
              </div>
              <div class="flex items-center gap-2">
                <CreditCard v-if="order?.payment_info.type" class="w-5 h-5 text-orange-500" />
                <Wallet v-else class="w-5 h-5 text-orange-500" />
                <span class="text-sm text-gray-600">{{order?.payment_info.type_label }}</span>
              </div>
            </div>
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <Package class="w-5 h-5 text-orange-500" />
                <h4 class="font-bold text-gray-900">TIPO DE ENTREGA</h4>
                <div class="ml-auto">
                  <MapPin class="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div class="px-2">
                <div class="flex items-center gap-2 mb-2">
                  <Store v-if="order?.shipping_info.method == 'pickup'" class="w-5 h-5 text-orange-500" />
                  <Truck v-else class="w-5 h-5 text-orange-500" />
                  <span class="font-medium text-gray-900">{{ order?.shipping_info.method == 'pickup' ? 'Recojo en Tienda' : 'Delivery' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Pin class="w-4 h-4" />
                  <span>{{ order?.shipping_info.address }}</span>
                </div>
                <div class="text-sm text-gray-600 mt-1">{{ order?.shipping_info.district }}</div>
              </div>
            </div>
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <DollarSign class="w-5 h-5 text-orange-500" />
                <h4 class="font-bold text-gray-900">MONTO A PAGAR</h4>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify-between w-full">
                  <span class="font-semibold">Envío</span>
                  <span class="font-semibold">{{ order?.totals.shipping_total.formatted }}</span>
                </div>
                <div class="flex justify-between w-full">
                  <span class="font-semibold">Subtotal</span>
                  <span class="font-semibold">{{ order?.totals.sub_total.formatted }}</span>
                </div>
                <div class="flex justify-between w-full">
                  <span class="font-semibold">IGV</span>
                  <span class="font-semibold">{{ order?.totals.tax_total.formatted }}</span>
                </div>
                <Separator class="my-2" />
                <div class="flex justify-between w-full">
                  <span class="font-semibold text-xl">Total</span>
                  <span class="font-semibold text-xl">{{ order?.totals.total.formatted }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CheckCircle, CreditCard, DollarSign, MapPin, Package, Pin, Store, Truck, User, Wallet } from 'lucide-vue-next';

const orderStore = useOrderStore()
const order = computed(() => orderStore.order);
const { clearCart } = useCartStore();

onMounted(() => {
  clearCart();
});

useHead({
  title: 'Pago Éxitoso',
});
</script>

<style></style>