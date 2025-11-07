<template>
  <li v-for="item in items" :key="item.slug" :class="[
    'relative',
    item.children?.length ? (depth === 0 ? 'group/menu' : 'group') : '',
    depth === 0 ? 'h-full flex items-center' : ''
  ]">
    <a :href="`/categoria/${item.slug}`" class="block px-4 py-2 hover:bg-primary-600"
      :class="depth === 0 ? 'h-full flex items-center' : ''">
      {{ item.name }}
    </a>

    <ul v-if="item.children?.length"
      class="absolute bg-white rounded text-black shadow-lg opacity-0 invisible transition-all duration-200 min-w-[200px]"
      :class="depth === 0
        ? 'top-full left-0 group-hover/menu:opacity-100 group-hover/menu:visible z-10'
        : 'top-0 left-full group-hover:opacity-100 group-hover:visible z-20'
        ">
      <MenuList :items="item.children" :depth="depth + 1" />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import type { MenuItem } from "@/types/layout";
defineProps<{ items: MenuItem[], depth: number }>()
</script>

<style></style>