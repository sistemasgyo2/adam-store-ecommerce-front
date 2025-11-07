<template>
  <LayoutAppContainer>
    <header :class="[
      'flex items-center justify-between py-4 bg-white md:px-0 z-50 transition-all duration-300',
      isScrolled ? 'fixed top-0 left-0 right-0 border border-gray-200 px-4 md:static backdrop-blur-xs bg-white/85' : 'relative',
      'md:relative'
    ]">
      <div class="md:hidden">
        <button @click="openMenu" type="button" aria-label="Menu">
          <Menu />
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <NuxtLink to="/">
          <img src="~/assets/images/logo_pyr.png" alt="Portátiles y Redes S.A.C." class="h-10" />
        </NuxtLink>
      </div>

      <div class="hidden md:flex flex-1 max-w-xl mx-6">
        <LayoutSearcher />
      </div>

      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-1 text-sm text-gray-700 gap-1.5 cursor-pointer" @click="openCart">
          <div class="relative rounded-full bg-slate-100 p-2.5 flex items-center justify-center">
            <ShoppingBag />
            <span v-if="totalQuantity > 0"
              class="absolute bg-primary w-5 h-5 text-sm text-center leading-4.5 text-white -top-1 -right-1 rounded-full">
              {{ totalQuantity }}
            </span>
          </div>
          <div class="hidden md:flex flex-col font-semibold">
            Mi Carrito
            <span class="font-normal">S/ {{ totalPrice }}</span>
          </div>
        </div>
      </div>
    </header>
  </LayoutAppContainer>
</template>

<script lang="ts" setup>
import { Menu, Search, ShoppingBag } from 'lucide-vue-next';

const ui = useUiStore()
const cart = useCartStore();

const { totalQuantity, totalPrice } = storeToRefs(cart);

const openMenu = () => {
  ui.toggleMenu();
}

const openCart = () => {
  ui.toggleCart();
}

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style></style>