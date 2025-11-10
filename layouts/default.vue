<template>
  <div>
    <LayoutHeader />
    <LayoutMainMenu />
    <slot />
    <LayoutFooter />
    <LayoutCart />
    <Toaster />
    <WhatsappButton />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from '@/components/ui/sonner';
import '@fontsource-variable/roboto';
import 'vue-sonner/style.css';

const layoutStore = useLayoutStore();

layoutStore.fetchMenu();
</script>

<style>

</style>