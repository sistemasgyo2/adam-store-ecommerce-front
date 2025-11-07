<template>
  <div class="bg-primary text-white">
    <LayoutAppContainer>
      <nav class="hidden md:flex justify-between items-center w-full">
        <ul class="flex h-12 space-x-4 items-center text-sm flex-1 justify-center">
          <MenuList :items="items" :depth="0" />
        </ul>
        <div v-if="!isAuthenticated">
          <Button class="bg-green-600 hover:bg-green-700" as-child>
            <NuxtLink to="/login">
              Iniciar Sesión
            </NuxtLink>
          </Button>
        </div>
        <div v-else class="flex items-center gap-2 font-medium w-auto shrink-0">
          <span>
            Bienvenido,
            {{ user?.name }}
          </span>
          <Button class="bg-blue-700 hover:bg-blue-800" @click="logout" as-child>
            <NuxtLink to="/dashboard">
              Ingresar
            </NuxtLink>
          </Button>
          <Button @click="logout" variant="destructive">Cerrar Sesión</Button>
        </div>
      </nav>
    </LayoutAppContainer>
  </div>
  <Sheet v-model:open="isMenuOpen">
    <SheetContent side="left" aria-describedby="undefined">
      <SheetHeader>

      </SheetHeader>
      <div class="w-full p-2">
        <AccordionMenu :items="items" />
      </div>
    </SheetContent>
  </Sheet>
</template>

<script lang="ts" setup async>
import AccordionMenu from './Menu/AccordionMenu.vue';
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import MenuList from './Menu/MenuList.vue';
import type { User } from '@/types/user';

const ui = useUiStore();
const router = useRouter();
const { isMenuOpen } = storeToRefs(ui);
const { isAuthenticated } = useSanctumAuth()
const { user, logout } = useSanctumAuth<User>()

const layoutStore = useLayoutStore();
const { items } = storeToRefs(layoutStore);

router.beforeEach(() => {
  ui.closeAll();
});
</script>

<style></style>