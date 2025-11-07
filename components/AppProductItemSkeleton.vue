<template>
  <div class="p-4 flex flex-col overflow-hidden">
    <div class="relative mb-4  w-full bg-gray-50 rounded overflow-hidden">
      <Skeleton class="h-[150px] w-[250px] rounded-xl" />
    </div>

    <div class="flex flex-col flex-grow gap-2.5">
      <!-- Brand name -->
      <Skeleton class="h-4 w-[80px]" />

      <!-- Product Name -->
      <Skeleton class="h-4 w-[250px]" />

      <div class="flex items-center justify-between mt-auto w-full">
        <div class="w-3/4 flex gap-2 items-center">
          <div class="flex flex-col gap-2">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-4 w-[100px]" />
          </div>
        </div>
        <div class="w-1/4 flex justify-end">
          <Skeleton class="h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>

<style></style>