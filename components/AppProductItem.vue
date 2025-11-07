<template>
  <div class="relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col overflow-hidden">
    <div class="relative mb-4 pt-[75%] w-full bg-gray-50 rounded overflow-hidden">
      <NuxtLink :to="`/producto/${product.slug}`" class="absolute inset-0 flex items-center justify-center">
        <NuxtImg :src="product.image" class="object-contain p-4 hover:scale-105 transition-transform duration-300"
          :alt="product.name" loading="lazy" />
      </NuxtLink>
    </div>

    <div v-if="product.is_new" class="absolute top-0 left-0 bg-red-800 text-white text-sm py-0.5 px-1.5 rounded-sm">
      Nuevo
    </div>

    <div v-if="product.has_discount"
      class="absolute top-0 right-0 bg-blue-800 text-white text-sm py-0.5 px-1.5 rounded-sm">
      -10%
    </div>

    <div class="flex flex-col flex-grow">
      <span class="text-xs text-gray-500 mb-1">{{ product.brand.name }}</span>

      <NuxtLink :to="`/producto/${product.slug}`" class="group" :aria-label="product.name">
        <h3 class="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <div class="flex items-center justify-between mt-auto w-full">
        <div class="w-3/4 flex gap-2 items-center">
          <div class="flex items-center gap-2">
            <span class="font-bold text-blue-500">{{ product.prices.price.formatted }}</span>
            <span v-if="product.prices.alt_price.formatted != null" class="text-sm text-gray-500 line-through">
              {{ product.prices.alt_price.formatted }}
            </span>
          </div>
          <!-- <span class="text-sm text-gray-500 line-through">S/ 25.00</span> -->
        </div>
        <div class="w-1/4 flex justify-end">
          <button aria-label="Add to cart"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
            <ShoppingCart class="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductItem } from '@/types/product';
import { ShoppingCart } from 'lucide-vue-next';

defineProps<{
  product: ProductItem
}>();
</script>

<style></style>