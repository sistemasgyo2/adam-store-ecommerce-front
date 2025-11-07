<template>
  <LayoutAppContainer class="py-6">
    <div class="flex flex-col justify-center gap-4 mb-8">
      <NuxtLink to="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Continuar Comprando
        </Button>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">
        Detalle de productos
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">

        <div v-for="item in cartStore.items" :key="item.id" class="overflow-hidden border rounded-lg">
          <div class="p-4">
            <div class="flex gap-4">
              <div class="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="item.image" :alt="item.name" fill class="object-contain p-2" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-semibold text-gray-900 line-clamp-2 mb-1">{{ item.name }}</h3>
                    <p v-if="item.options.length > 0" class="space-x-2 text-sm text-gray-600">
                      <span v-for="option in item.options">{{ option.option }}:
                        {{ option.value }}</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-700 hover:bg-red-50"
                    @click="removeItem(item.id)" :disabled="isLoading">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-bold text-blue-600">{{ item.price.formatted }}</span>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="flex items-center border rounded-lg">
                      <Button variant="ghost" size="sm" class="h-10 w-10 p-0"
                        @click="updateQuantity(item.id, item.quantity - 1)" :disabled="isLoading">
                        <Minus class="w-4 h-4" />
                      </Button>
                      <span class="w-16 h-full text-center border-0">{{ item.quantity }}</span>
                      <Button variant="ghost" size="sm" class="h-10 w-10 p-0"
                        @click="updateQuantity(item.id, item.quantity + 1)" :disabled="isLoading">
                        <Plus class="w-4 h-4" />
                      </Button>
                    </div>
                    <div class="text-right min-w-[80px]">
                      <p class="font-semibold">{{ item.subtotal.formatted }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <Card class="sticky top-4">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Tag class="w-5 h-5" />
              Resumen de la compra
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">S/ {{ cartStore.totalPrice }}</span>
              </div>
            </div>

            <Separator />

            <div class="space-y-3">
              <Button class="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700" as-child>
                <NuxtLink to="/checkout">
                  Finalizar Compra
                </NuxtLink>
              </Button>
              <Button class="w-full bg-amber-500 hover:bg-amber-600" as-child>
                <NuxtLink to="/">
                  Continuar comprando
                </NuxtLink>
              </Button>
            </div>

            <Separator />

            <div class="text-center">
              <NuxtLink to="#" class="font-medium">¿Quieres consultar con ventas?</NuxtLink>
            </div>

            <div class="text-center text-xs text-gray-500 pt-4 border-t">
              <p class="flex justify-center items-end mb-1 gap-1">
                <Lock :size="17" /> Compra 100% segura
              </p>
              <p>Aceptamos todas las tarjetas</p>
              <p>* Total incluye el IGV</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </LayoutAppContainer>
</template>

<script lang="ts" setup>
import { Minus, Plus, Trash2, ArrowLeft, Tag, Lock } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cart } from "@/types/cart";

const cartStore = useCartStore();
const cartId = cartStore.id;
const isLoading: Ref<boolean> = ref<boolean>(false);

const fetchCart = async () => {
  try {
    const { data } = await useSanctumFetch<Cart>(`/api/carts/${cartId}`)

    if (data.value) {
      cartStore.setDataCart(data.value);
    }
  } catch (e: any) {
    console.error(e);
  }
}

const updateQuantity = async (item: number, quantity: number) => {
  if (isLoading.value) return;

  isLoading.value = true;
  await cartStore.updateItem(item, quantity);
  isLoading.value = false;
}

const removeItem = async (item: number) => {
  if (isLoading.value) return;

  isLoading.value = true;
  await cartStore.deleteItem(item,);
  isLoading.value = false;
}

onMounted(() => {
  fetchCart();
});

definePageMeta({
  ssr: false
});

useHead({
  title: 'Carrito de Compras',
});
</script>

<style></style>