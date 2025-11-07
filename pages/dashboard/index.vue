<template>
  <LayoutAppContainer class="py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mi cuenta</h1>
      <Button variant="outline" asChild>
        <NuxtLink href="/">Volver a la tienda</NuxtLink>
      </Button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-1">
        <div class="space-y-2">
          <Button v-for="item in sidebarNavItems" :key="item.id" variant="ghost"
            :class="['w-full justify-start text-md', { 'bg-muted': activeTab == item.id, 'text-blue-700': activeTab == item.id }]"
            @click="activeTab = item.id">
            {{ item.title }}
          </Button>
          <Separator />
          <Button variant="ghost" @click="logout"
            class="w-full justify-start text-md text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut class="w-4 h-4 mr-2" /> Cerrar Sesión
          </Button>
        </div>
      </div>
      <div class="lg:col-span-3">
        <AccountMyAccount v-if="activeTab == 'account' && user" :user="user" />
        <AccountInfo v-if="activeTab == 'information'" />
        <AccountPurchases v-if="activeTab == 'purchases'" />
      </div>
    </div>
  </LayoutAppContainer>
</template>

<script lang="ts" setup>
import type { User } from '@/types/user';
import { LogOut } from 'lucide-vue-next';

definePageMeta({
  middleware: ['sanctum:auth'],
});

const activeTab = ref("account")

const { user, logout } = useSanctumAuth<User>();

const sidebarNavItems = [
  {
    title: 'Mi Cuenta',
    id: 'account',
  },
  {
    title: 'Información',
    id: 'information',
  },
  {
    title: 'Mis Compras',
    id: 'purchases',
  },
];
</script>

<style></style>