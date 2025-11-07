<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        <div class="text-xl font-bold text-gray-900">
          Datos de Facturación
        </div>
        <div v-if="isAuthenticated" class="flex gap-2 items-end justify-center flex-col">
          <Label>¿Desea usar los datos de facturación almacenados ?</Label>
          <Switch v-model="useStoredData" @update:model-value="handleUseStoredData" :disabled="loadingStoredData" />
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="grid gap-2">
        <Label>¿Qué tipo de comprobante desea?</Label>
        <RadioGroup v-model="billingInfo.type" @update:model-value="onUpdateDocumentType" class="flex gap-8">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="boleta" id="boleta" :disabled="usingStoredData" />
            <Label for="boleta" class="cursor-pointer font-medium">
              Boleta
            </Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="factura" id="factura" :disabled="usingStoredData" />
            <Label for="factura" class="cursor-pointer font-medium">
              Factura
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div class="space-y-4 pt-6 border-t">
        <h3 class="text-lg font-semibold text-gray-900">Contacto principal</h3>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="grid gap-2 md:col-span-2">
            <Label>Tipo de Documento <span class="text-red-500">*</span></Label>
            <Select v-model:model-value="billingInfo.document_type"
              :disabled="billingInfo.type == 'factura' || usingStoredData"
              @update:model-value="handleChangeDocumentType">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Selecciona un distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="ruc" value="ruc">
                  RUC
                </SelectItem>
                <SelectItem key="dni" value="dni">
                  DNI
                </SelectItem>
                <SelectItem key="ce" value="ce">
                  Carnet de extranjería
                </SelectItem>
              </SelectContent>
            </Select>
            <InputError :message="errors.document_type" />
          </div>

          <div class="grid gap-2 md:col-span-3">
            <Label for="document_number">Número de Documento <span class="text-red-500">*</span></Label>
            <div class="relative w-full max-w-sm items-center">
              <Input id="document_number" v-model="billingInfo.document_number" @input="handleDocument" class="pr-10"
                :readonly="isLoadingConsultDocument || usingStoredData" />
              <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                <Loader2 v-if="isLoadingConsultDocument" class="size-6 text-primary animate-spin" />
              </span>
            </div>
            <InputError :message="errors.document_number" />
          </div>

          <div class="grid gap-2 md:col-span-6">
            <Label for="business_name">
              {{ billingInfo.document_type == 'ruc' ? 'Razón Social' : 'Nombre Completo' }} <span
                class="text-red-500">*</span>
            </Label>
            <Input id="business_name" v-model="billingInfo.business_name"
              :readonly="billingInfo.document_type != 'ce' || usingStoredData" />
            <InputError :message="errors.business_name" />
          </div>
          <div class="grid gap-2 md:col-span-3">
            <Label for="document_number">Correo electrónico <span class="text-red-500">*</span></Label>
            <Input id="document_number" type="email" v-model="billingInfo.email" :readonly="usingStoredData" />
            <InputError :message="errors.email" />
          </div>
          <div class="grid gap-2 md:col-span-3">
            <Label for="document_number">Teléfono <span class="text-red-500">*</span></Label>
            <Input id="document_number" v-model="billingInfo.phone" :readonly="usingStoredData" />
            <InputError :message="errors.phone" />
          </div>
        </div>
      </div>
      <div class="pt-6">
        <Button class="w-full" @click="onSaveBillingInfo()" :disabled="isLoading">
          <div v-if="isLoading" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
          </div>
          <div v-else>Continuar</div>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import type { BillingInfo } from '@/types/checkout';
import { Label } from '../ui/label';
import InputError from '../InputError.vue';
import { regex } from '@/lib/utils';
import { Loader2 } from 'lucide-vue-next';
import type { ConsultDocumentResponse } from '@/types/pages';
import { toast } from 'vue-sonner';
import { Switch } from '../ui/switch';
import type { Customer } from '@/types/user';

const { billingInfo, cartId } = defineProps<{
  billingInfo: BillingInfo,
  cartId: string,
}>();

const emit = defineEmits(['updateCurrentStep']);

const { isAuthenticated } = useSanctumAuth()
const sanctumFetch = useSanctumClient();
const isLoading: Ref<boolean> = ref<boolean>(false);
const isLoadingConsultDocument: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);
const useStoredData = ref<boolean>(false);
const usingStoredData = ref<boolean>(false);
const loadingStoredData = ref<boolean>(false);

type BillingInfoErrors = {
  type?: string;
  document_type?: string;
  document_number?: string;
  business_name?: string;
  email?: string;
  phone?: string;
}

const errors = reactive<BillingInfoErrors>({})

const onUpdateDocumentType = () => {
  if (billingInfo.type == 'factura') {
    billingInfo.document_type = 'ruc';
  } else {
    billingInfo.document_type = 'dni';
  }

  clearErrors();
}

const clearErrors = () => {
  errors.type = undefined;
  errors.document_type = undefined;
  errors.document_number = undefined;
  errors.business_name = undefined;
  errors.email = undefined;
  errors.phone = undefined;
}

const onSaveBillingInfo = async () => {
  clearErrors();

  if (!billingInfo.document_type) {
    errors.document_type = 'Selecciona un tipo de documento';
  }

  if (billingInfo.type == 'boleta') {
    if (billingInfo.document_type == 'ruc') {
      errors.document_type = 'Para Boleta el tipo de documento no puede ser RUC';
    }

    if (billingInfo.document_type == 'dni' && !regex().dni.test(billingInfo.document_number.trim())) {
      errors.document_number = 'Ingrese un número de documento válido';
    }
  }

  if (billingInfo.type == 'factura') {
    if (billingInfo.document_type != 'ruc') {
      errors.document_type = 'Para Factura el tipo de documento debe de ser RUC';
    }

    if (!regex().ruc.test(billingInfo.document_number.trim())) {
      errors.document_number = 'Ingrese un número de RUC válido';
    }
  }

  if (!billingInfo.business_name.trim() || billingInfo.business_name.trim().length < 5) {
    errors.business_name = 'Ingresa un nombre válido'
  }

  if (!regex().email.test(billingInfo.email.trim())) {
    errors.email = 'Ingresa un correo electrónico válido'
  }

  if (!regex().phone.test(billingInfo.phone.trim())) {
    errors.phone = 'Ingresa un número de teléfono válido'
  }

  const hasErrors = Object.values(errors).some(error => error !== undefined);

  if (!hasErrors) {
    isLoading.value = true;

    try {
      await sanctumFetch(`/checkout/${cartId}/billing-info`, {
        method: 'POST',
        body: getBillingInfoPaylod(billingInfo),
      });

      emit('updateCurrentStep', 'order_summary');
    } catch (error) {
      const err = useSanctumError<keyof BillingInfoErrors>(error);

      if (err.isValidationError) {
        Object.assign(errors, err.fieldErrors)
      } else if (err.generalMessage) {
        generalError.value = err.generalMessage
      }
    } finally {
      isLoading.value = false;
    }
  }
}

const getBillingInfoPaylod = (data: BillingInfo) => {
  return {
    "type": data.type,
    "document_type": data.document_type,
    "document_number": data.document_number,
    "business_name": data.business_name,
    "phone": data.phone,
    "email": data.email,
  };
}

const handleDocument = () => {
  if (billingInfo.document_type == 'ruc' && billingInfo.document_number.length == 11) {
    consultDocument();
  } else if (billingInfo.document_type == 'dni' && billingInfo.document_number.length == 8) {
    consultDocument();
  }
}

const consultDocument = async () => {
  if (billingInfo.document_type == 'ce') return;

  isLoadingConsultDocument.value = true;
  const response = await sanctumFetch<ConsultDocumentResponse>(`/consult/${billingInfo.document_type}/${billingInfo.document_number}`, {
    method: 'POST',
  });

  if (response.valid) {
    billingInfo.business_name = response.name ?? '';
  } else {
    billingInfo.business_name = '';
    toast.warning(response.error ?? 'No pudimos validar el documento');
  }
  isLoadingConsultDocument.value = false;
}

const handleChangeDocumentType = () => {
  billingInfo.document_number = '';
  billingInfo.business_name = '';
}

const handleUseStoredData = async () => {
  if (useStoredData.value) {
    loadingStoredData.value = true;

    const response = await sanctumFetch<Customer>('/account/get-info');

    if (response && Object.keys(response).length > 0) {
      billingInfo.business_name = response.business_name ?? '';
      billingInfo.document_number = response.document_number ?? '';
      billingInfo.email = response.email ?? '';
      billingInfo.phone = response.business_phone ?? '';
      billingInfo.document_type = response.document_type ?? 'dni';
      billingInfo.type = response.document_type == 'ruc' ? 'factura' : 'boleta';

      usingStoredData.value = response.business_name != undefined && response.document_type != undefined;
    } else {
      useStoredData.value = false;
      toast.warning('No se encontraron datos de facturación')
    }
  } else {
    billingInfo.business_name = '';
    billingInfo.document_number = '';
    billingInfo.email = '';
    billingInfo.phone = '';
    billingInfo.document_type = 'dni';
    billingInfo.type = 'boleta';
    usingStoredData.value = false;
  }
  loadingStoredData.value = false;
}
</script>

<style></style>