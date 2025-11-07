<template>
  <div class="bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <NuxtLink href="/">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Volver al inicio
          </NuxtLink>
        </Button>
      </div>

      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
          <p class="text-gray-600 mt-2">Accede a tu cuenta para continuar</p>
        </CardHeader>

        <CardContent class="p-6">
          <LoginForm />

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <NuxtLink to="/register" class="text-blue-600 hover:underline font-medium">
                Regístrate aquí
              </NuxtLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-vue-next';

useHead({
  title: 'Iniciar Sesión',
});

definePageMeta({
  middleware: ['sanctum:guest'],
});
</script>

<style></style>