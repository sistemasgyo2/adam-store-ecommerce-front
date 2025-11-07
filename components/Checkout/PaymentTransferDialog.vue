<template>
  <div>
    <Dialog v-model:open="dialogVisible">
      <DialogContent class="[&>button]:hidden">
        <DialogHeader>
          <div class="flex items-center justify-between">
            <Button v-if="selectedFile" @click="restartVoucherUpload" variant="ghost" size="icon"
              class="h-8 w-8 text-orange-500">
              <ArrowLeft class="size-6" />
            </Button>
            <DialogTitle class="text-lg font-semibold text-center flex-1">
              {{ selectedFile ? "Último paso!" : "Ya casi terminas!" }}
            </DialogTitle>
            <Button @click="closeDialog" variant="ghost" size="icon" class="h-8 w-8 text-orange-500">
              <X class="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div v-if="!isLoading" class="p-4 space-y-4">
          <div v-if="!selectedFile" class="space-y-4">
            <div class="text-center space-y-2">
              <p class="text-sm text-gray-600">Ahora transfiere el monto de</p>
              <p class="text-2xl font-bold text-blue-600">{{ cartStore.totals.total.formatted }}</p>
              <p class="text-sm text-gray-600">A una de las siguientes cuentas:</p>
              <p class="text-sm font-medium text-gray-800">Titular: {{ companyData?.business_name }}</p>
            </div>

            <div class="space-y-3">
              <div v-for="(account, index) in bankAccounts" :key="index" :class="`p-3 rounded-lg border-2 bg-white`">
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <p class="font-medium text-gray-800">{{ account.bank_name }}</p>
                    <p class="text-sm text-green-600 font-medium">CUENTA {{ account.account_type.toUpperCase() }}</p>
                    <p class="text-sm font-mono text-gray-700">{{ account.account_number }}</p>
                    <p class="text-xs text-gray-500">CCI: {{ account.cci }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center text-sm text-gray-600 px-4">
              Realiza una captura de pantalla en el momento de pago y haz click en "Continuar"
            </div>

            <Button @click="handleUploadClick"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-base font-medium">
              Subir Voucher
            </Button>
          </div>
          <div v-else class="space-y-4">
            <div class="border-2 border-dashed border-orange-300 rounded-xl p-4 bg-orange-50">
              <div class="text-center space-y-3">
                <p class="text-sm text-gray-600">
                  Asegúrese de que la constancia sea correcta y haga click en:
                </p>
                <p class="font-medium text-gray-800">Finalizar la compra</p>

                <div class="bg-white rounded-lg p-4 border">
                  <img v-if="previewUrl" :src="previewUrl" alt="Voucher preview"
                    class="w-full h-48 object-contain rounded-lg" />
                  <div v-else class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p class="text-gray-500">Vista previa no disponible</p>
                  </div>
                </div>

                <div class="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle class="h-4 w-4" />
                  <span class="text-sm font-medium">{{ selectedFile.name }}</span>
                </div>

                <Button variant="ghost" @click="handleReplaceFile"
                  class="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Reemplazar Constancia
                </Button>
              </div>
            </div>

            <Button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-base font-medium"
              :disabled="savingOrder" @click="handleSaveOrder">
              <div v-if="savingOrder" class="flex items-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" />
              </div>
              <div v-else>Finalizar La Compra</div>
            </Button>
          </div>
        </div>
        <div v-else class="w-full flex justify-center">
          <Loader2 class="size-8 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>

    <input ref="fileInputRef" type="file" accept="image/*,.pdf" @change="handleFileSelect" class="hidden" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, CheckCircle, Loader2, RefreshCw, X } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { BankAccount, OrderData } from '@/types/checkout';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  }
});

const sanctumFetch = useSanctumClient();
const cartStore = useCartStore();
const orderStore = useOrderStore()
const emit = defineEmits(['update:modelValue']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isLoading = ref<boolean>(true);
const savingOrder = ref<boolean>(false);
const selectedFile: Ref<File | null> = ref<File | null>(null);
const previewUrl: Ref<string | null> = ref<string | null>(null);
const fileInputRef = ref();
const bankAccounts: Ref<BankAccount[]> = ref<BankAccount[]>([]);
const { companyData } = useLayoutStore();

const handleFileSelect = (event: any) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file;

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      previewUrl.value = url;
    } else {
      previewUrl.value = null;
    }
  }
}

const handleUploadClick = () => {
  fileInputRef.value.click()
}

const handleReplaceFile = () => {
  fileInputRef.value.click()
}

const restartVoucherUpload = () => {
  selectedFile.value = null;
  previewUrl.value = null;
}

const getBankAccounts = async () => {
  const response = await sanctumFetch<BankAccount[]>('/get-bank-accounts', {
    method: 'get'
  });

  bankAccounts.value = response;
}

const prepareData = async () => {
  getBankAccounts();
  await cartStore.getCart()
  isLoading.value = false;
}

const closeDialog = () => {
  emit('update:modelValue', false);
}

const handleSaveOrder = async () => {
  savingOrder.value = true;
  try {
    if (selectedFile.value == null) {
      return;
    }
    
    const formData = new FormData()
    formData.append('type', 'transfer')
    formData.append('file', selectedFile.value)

    const response = await sanctumFetch<OrderData>(`/checkout/${cartStore.id}/process`, {
      method: 'post',
      body: formData
    });

    orderStore.setOrder(response);

    navigateTo('payment-success');
  }
  catch (error) {
    const err = useSanctumError(error);

    if (err.isValidationError) {

    } else if (err.generalMessage) {

    }
  }
  finally {
    savingOrder.value = false;
  }
}

onMounted(() => {
  prepareData();
})
</script>

<style></style>