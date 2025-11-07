<template>
  <Sheet v-model:open="isCartOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Carrito</SheetTitle>
      </SheetHeader>
      <div class="p-4 h-full flex flex-col">
        <div class="flex-1 overflow-y-auto pr-2 -mr-2">
          <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <p class="text-gray-500 text-lg">Tu carrito está vacío</p>
            <p class="text-gray-400 text-sm mt-2">Agrega algunos productos para comenzar</p>
          </div>
          <div v-else class="space-y-2">
            <div class="flex justify-between text-sm">
              <div>Items: {{ totalItems }}</div>
            </div>
            <div v-for="item in items" :key="item.id" class="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                <img :src="item.image" :alt="item.name" fill class="object-contain p-2" />
              </div>

              <div class="flex-1 min-w-0 relative">
                <div v-if="isLoading"
                  class="size-7 bg-white rounded shadow absolute right-0 flex items-center justify-center">
                  <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
                </div>

                <h4 class="font-medium text-sm text-gray-900 line-clamp-2 mb-0.5">{{ item.name }}</h4>
                <p class="space-x-2 text-sm text-gray-500 mb-1">
                  <span v-for="option in item.options">
                    {{ option.option }}: {{ option.value }}
                  </span>
                </p>

                <div class="flex items-center justify-between mt-2">
                  <p class="text-lg font-bold text-blue-600">{{ item.price.formatted }}</p>
                  <div class="flex items-center border rounded">
                    <Button variant="ghost" size="sm" @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="isLoading" class="h-8 w-8 p-0">
                      <Minus class="w-3 h-3" />
                    </Button>
                    <span class="px-3 py-1 text-sm font-medium">{{ item.quantity }}</span>
                    <Button variant="ghost" size="sm" @click="updateQuantity(item.id, item.quantity + 1)"
                      :disabled="isLoading" class="h-8 w-8 p-0">
                      <Plus class="w-3 h-3" />
                    </Button>
                  </div>

                  <Button variant="ghost" size="sm" @click="removeItem(item.id)" :disabled="isLoading"
                    class="size-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 class="size-4.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="items.length > 0" class="mb-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-foreground  font-medium">Subtotal:</span>
            <span class="font-medium">S/ {{ totalPrice }}</span>
          </div>
        </div>
        <div v-if="items.length > 0" class="w-full text-center flex flex-col gap-y-4 justify-center items-center">
          <Button class="w-full cursor-pointer" size="lg" @click="onFinishShipping()">
            Finalizar compra
          </Button>
          <Button variant="link"
            class="w-full cursor-pointer text-gray-600 underline hover:text-blue-600 transition-colors" as-child>
            <NuxtLink to="/cart">
              Ver mis productos
            </NuxtLink>
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
  <Dialog v-model:open="isAuthDialogShow">
    <DialogContent class="md:max-w-4xl w-full p-0 gap-0 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        <div class="p-8 flex flex-col justify-start bg-gray-50 h-full">
          <div class="max-w-sm mx-auto w-full">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">No tengo cuenta</h2>

            <p class="text-red-600 mb-8 leading-relaxed text-center">
              Al crear una cuenta, tendrá un historial de sus compras, seguimiento de pedidos, etc.
            </p>

            <div class="space-y-4">
              <Button @click="onClickAuth('/checkout')" variant="link" size="lg" class="w-full">
                Continuar como invitado
              </Button>

              <Button @click="onClickAuth('/register')" size="lg" class="w-full">
                Crear cuenta
              </Button>
            </div>
          </div>
        </div>
        <div class="p-8 flex flex-col justify-start bg-white">
          <div class="max-w-sm mx-auto w-full">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Ya tengo cuenta</h2>

            <p class="text-gray-600 mb-8 leading-relaxed text-center">
              Si ya tiene una cuenta ingrese su correo electrónico y contraseña en los campos a continuación:
            </p>

            <LoginForm :redirect-checkout="`dialog`" />
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  <AlertDialog :open="visibleAlert">
        <AlertDialogContent>
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <TriangleAlert class="text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">¿Deseas eliminar este producto?</h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">Al eliminar el último ítem, tu carrito quedará vacío. Sin embargo, los datos de recojo y facturación se mantienen. Podrás seguir agregando productos en cualquier momento.</p>
                    </div>
                </div>
            </div>
            <AlertDialogFooter>
                <Button type="button" @click="visibleAlert = false;" variant="outline" :disabled="loadingAlert">Cancelar</Button>
                <Button type="button" @click="onConfirmAlert" variant="destructive" :disabled="loadingAlert">
                    <Loader2 v-if="loadingAlert" class="w-4 h-4 mr-2 animate-spin" />
                    Confirmar
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script lang="ts" setup>
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, Trash2, TriangleAlert } from 'lucide-vue-next';
import { Dialog, DialogContent } from '../ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogFooter } from '@/components/ui/alert-dialog';
import LoginForm from '../LoginForm.vue';
const ui = useUiStore();
const cart = useCartStore();
const { isAuthenticated } = useSanctumAuth();

const { isCartOpen, isAuthDialogShow } = storeToRefs(ui);

const totalItems = computed(() => cart.items.length);

const { items, totalPrice } = storeToRefs(cart);

const isLoading: Ref<boolean> = ref<boolean>(false);

const visibleAlert = ref(false);
const loadingAlert = ref(false);
const onConfirmAlert = ref<() => void>(() => { });

onMounted(async () => {
  await cart.fetchCart();
});

const updateQuantity = async (item: number, quantity: number) => {
  if (isLoading.value) return;

  isLoading.value = true;
  await cart.updateItem(item, quantity);
  isLoading.value = false;
}

const removeItem = async (item: number) => {
  if (isLoading.value) return;

  if (items.value.length === 1) {
    visibleAlert.value = true;
    onConfirmAlert.value = () => onRemoveItem(item);
    return;
  }

  onRemoveItem(item);
}

const onRemoveItem = async (item: number) => {
  isLoading.value = true;
  loadingAlert.value = true;
  await cart.deleteItem(item,);
  isLoading.value = false;
  loadingAlert.value = false;
  visibleAlert.value = false;
}

const onClickAuth = (to: string) => {
  ui.toggleAuthDialog();

  navigateTo(to);
}

const onFinishShipping = () => {
  if (isAuthenticated.value) {
    navigateTo('/checkout');
  } else {
    ui.toggleAuthDialog();
  }
}
</script>

<style></style>