<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <LayoutAppContainer class="h-screen">
    <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="text-center">
        <p class="text-base font-semibold text-blue-600">{{ error?.statusCode }}</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          {{ error?.statusMessage }}
        </h1>
        <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Lo sentimos, no pudimos encontrar la página que buscas.</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <NuxtLink @click="clearError({ redirect: '/' })"
            class="cursor-pointer rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Ir al Inicio
          </NuxtLink>
        </div>
      </div>
    </main>
  </LayoutAppContainer>
</template>

<style></style>