<template>
  <div class="w-full max-w-xs mx-auto text-sm">
    <AccordionItem v-for="(item, index) in items" :key="index" :item="item" />
  </div>
</template>

<script setup lang="ts">
import AccordionItem from './AccordionItem.vue';
import type { MenuItem } from "@/types/layout";

defineProps<{ items: MenuItem[] }>()
</script>