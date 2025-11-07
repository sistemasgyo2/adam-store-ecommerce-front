<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl font-bold text-gray-900">¿Cómo entregamos tu compra?</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <Alert v-if="generalError" variant="destructive">
        <XCircle class="h-4 w-4" />
        <AlertDescription>{{ generalError }}</AlertDescription>
      </Alert>

      <RadioGroup v-model="deliveryInfo.method" @update:model-value="onUpdateDeliveryType" class="flex gap-8">
        <div v-if="allowPickup" class="flex items-center space-x-2">
          <RadioGroupItem value="pickup" id="pickup" />
          <Label for="pickup" class="cursor-pointer font-medium">
            Recojo en tienda
          </Label>
        </div>
        <div v-if="allowDelivery" class="flex items-center space-x-2">
          <RadioGroupItem value="delivery" id="delivery" />
          <Label for="delivery" class="cursor-pointer font-medium">
            Delivery
          </Label>
        </div>
      </RadioGroup>

      <div class="grid grid-cols-3 gap-2">
        <div class="grid gap-2">
          <Label for="pickupDepartment">
            Departamento <span class="text-red-500">*</span>
          </Label>
          <Select :modelValue="deliveryInfo.department" @update:modelValue="onUpdateDepartment">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="department in departments" :key="department.id" :value="department">
                {{ department.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <InputError :message="errors.department" />
        </div>

        <div class="grid gap-2">
          <Label for="pickupProvince">
            Provincia <span class="text-red-500">*</span>
          </Label>
          <Select :modelValue="deliveryInfo.province" @update:modelValue="onUpdateProvince"
            :disabled="deliveryInfo.method == 'pickup' || !deliveryInfo.department || provinces.length === 0">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecciona una provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="province in provinces" :key="province.id" :value="province">
                {{ province.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <InputError :message="errors.province" />
        </div>

        <div class="grid gap-2">
          <Label for="pickupDistrict">
            Distrito <span class="text-red-500">*</span>
          </Label>
          <Select :modelValue="deliveryInfo.district" @update:modelValue="onUpdateDistrict"
            :disabled="districts.length === 0">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecciona un distrito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="district in districts" :key="district.id" :value="district">
                {{ district.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <InputError :message="errors.district" />
        </div>
      </div>

      <div v-if="deliveryInfo.method === 'pickup'" class="space-y-4">
        <div v-if="deliveryInfo.department && !isLoadingDeliveryOptions" class="space-y-3">
          <div v-for="store in stores" :key="store.id" :class="`p-4 border-2 rounded-lg cursor-pointer transition-colors ${deliveryInfo.store?.id === store.id ? 'border-primary bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'}`" @click="onSelectStore(store)">
            <div class="flex items-start gap-3">
              <div
                class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <StoreIcon />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ store.name }}</h3>
                <p class="text-sm text-gray-600 mt-1"><strong>Dirección:</strong> {{ store.address }}</p>
                <p v-if="store.schedule" class="text-sm text-gray-700 mt-2">
                  <strong>Horario de atención:</strong> {{ store.schedule }}
                </p>
                <p v-if="store.availability" class="text-sm text-gray-700 mt-2">
                  <strong>Disponibilidad:</strong> {{ store.availability }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="isLoadingDeliveryOptions" class="flex items-center justify-center">
          <Loader2 class="size-7 animate-spin text-primary" />
        </div>
      </div>

      <div v-if="deliveryInfo.method === 'delivery'" class="space-y-4">
        <div class="grid gap-2">
          <Label for="address">
            Dirección:
          </Label>
          <Input id="address" placeholder="Avenida 123" v-model="deliveryInfo.address" />
          <InputError :message="errors.address" />
        </div>
        <div
          v-if="deliveryInfo.department && deliveryInfo.province && deliveryInfo.district && !isLoadingDeliveryOptions"
          class="space-y-3">
          <div v-for="deliveryOption in deliveryOptions" :key="deliveryOption.id" :class="`p-4 border-2 rounded-lg cursor-pointer transition-colors 
              ${deliveryInfo.delivery_option?.id === deliveryOption.id ? 'border-primary bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'}`" @click="deliveryInfo.delivery_option = deliveryOption">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                <Truck />
              </div>
              <div class="w-full flex justify-between items-center">
                <div> 
                  <h3 class="font-semibold text-gray-900">{{ deliveryOption.name }}</h3>
                  <p class="text-sm text-gray-500">{{ deliveryOption.availability }}</p>
                </div>
               
                <p class="text-sm text-gray-600 mt-1">{{ deliveryOption.fee.formatted }}</p>
              </div>
            </div>
          </div>
          <div v-if="showAlertDeliveryOptionEmpty">
            <Alert variant="default" class="border-primary">
              <AlertDescription class="text-black">
                Hola, lamentablemente no contamos con Delivery para la dirección seleccionada. Actualmente, solo disponemos de recojo en tienda, ¡Gracias por tu comprensión!
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <div v-else-if="isLoadingDeliveryOptions" class="flex items-center justify-center">
          <Loader2 class="size-7 animate-spin text-primary" />
        </div>
        <InputError :message="errors.delivery_option" />
      </div>

      <div class="space-y-4 pt-6 border-t">
        <h3 v-if="deliveryInfo.method == 'pickup'" class="text-lg font-semibold text-gray-900">¿Quien retira la compra?
        </h3>
        <h3 v-else class="text-lg font-semibold text-gray-900">¿La compra se entrega a?</h3>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="grid gap-2 md:col-span-2">
            <Label>Tipo de Documento <span class="text-red-500">*</span></Label>
            <Select v-model:model-value="deliveryInfo.document_type">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Selecciona un distrito" />
              </SelectTrigger>
              <SelectContent>
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
            <Input id="document_number" v-model="deliveryInfo.document_number" />
            <InputError :message="errors.document_number" />
          </div>
        </div>

        <div class="grid gap-2 md:col-span-3">
          <Label for="fullName">Nombre Completo <span class="text-red-500">*</span></Label>
          <Input id="fullName" v-model="deliveryInfo.name" />
          <InputError :message="errors.name" />
        </div>
        <div class="grid gap-2">
          <Label for="phone">Teléfono <span class="text-red-500">*</span></Label>
          <Input id="phone" maxLength="9" v-model="deliveryInfo.phone" />
          <InputError :message="errors.phone" />
        </div>
        <div class="grid gap-2">
          <Label for="phone">Observaciones</Label>
          <Textarea v-model="deliveryInfo.notes" />
        </div>
      </div>

      <div class="pt-6">
        <Button class="w-full" @click="onSaveDeliveryInfo()" :disabled="isLoading">
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
import type { DeliveryInfo, DeliveryOption, Store, UbigeoItem } from '@/types/checkout';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import Card from '../ui/card/Card.vue';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, StoreIcon, Truck, XCircle } from 'lucide-vue-next';
import { Textarea } from '../ui/textarea';
import { regex } from '@/lib/utils';
import { Alert, AlertDescription } from '../ui/alert';

const { deliveryInfo, allowDelivery, allowPickup, cartId } = defineProps<{
  deliveryInfo: DeliveryInfo,
  allowDelivery: boolean,
  allowPickup: boolean,
  cartId: string,
}>();

const emit = defineEmits(['updateCurrentStep', 'updateCartData']);

const sanctumFetch = useSanctumClient();
const { store } = useCartStore();

type DeliveryInfoErrors = {
  department?: string
  province?: string
  district?: string
  store?: string
  delivery_option?: string
  address?: string
  document_type?: string
  document_number?: string
  name?: string
  phone?: string
}

const isLoadingDeliveryOptions: Ref<boolean> = ref<boolean>(false);
const errors = reactive<DeliveryInfoErrors>({})

const departments: Ref<UbigeoItem[]> = ref<UbigeoItem[]>([]);
const provinces: Ref<UbigeoItem[]> = ref<UbigeoItem[]>([]);
const districts: Ref<UbigeoItem[]> = ref<UbigeoItem[]>([]);
const stores: Ref<Store[]> = ref<Store[]>([]);
const deliveryOptions: Ref<DeliveryOption[]> = ref<DeliveryOption[]>([]);
const isLoading: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);
const showAlertDeliveryOptionEmpty: Ref<boolean> = ref<boolean>(false);

const onUpdateDeliveryType = () => {
  deliveryInfo.store = undefined;
  deliveryInfo.delivery_option = undefined;
  deliveryInfo.address = undefined;
  deliveryInfo.department = null;
  deliveryInfo.province = null;
  deliveryInfo.district = null;
  departments.value = [];
  provinces.value = [];
  districts.value = [];
  showAlertDeliveryOptionEmpty.value = false;

  clearErrors();

  getDepartments();
}

const getDepartments = async () => {
  let url = '/ubigeo/departments';

  if (deliveryInfo.method == 'pickup') {
    url = '/ubigeo/departments/stores';
  }

  const response = await sanctumFetch<UbigeoItem[]>(url, {
    method: 'GET',
  });

  departments.value = response;
}

const getProvinces = async () => {
  if (deliveryInfo.department == null) return;

  const response = await sanctumFetch<UbigeoItem[]>(`/ubigeo/provinces/${deliveryInfo.department.id}`, {
    method: 'GET',
  });

  provinces.value = response;
}

const getDistricts = async () => {
  if (deliveryInfo.province == null) return;

  const response = await sanctumFetch<UbigeoItem[]>(`/ubigeo/district/${deliveryInfo.province.id}`, {
    method: 'GET',
  });

  districts.value = response;
}

const onUpdateDepartment = async (department: UbigeoItem) => {
  provinces.value = [];
  districts.value = [];

  deliveryInfo.department = department;
  deliveryInfo.province = null;
  deliveryInfo.district = null;

  if (deliveryInfo.method == 'delivery') {
    await getProvinces();
  } else {
    getStores();
  }
}

const onUpdateProvince = async (province: UbigeoItem) => {
  districts.value = [];

  deliveryInfo.province = province;
  deliveryInfo.district = null;

  await getDistricts();
}

const onUpdateDistrict = (district: UbigeoItem) => {
  deliveryInfo.district = district;

  if (deliveryInfo.method == 'pickup') {
    getStores();
  } else if (deliveryInfo.method == 'delivery') {
    getDeliveryOptions();
  }
}

const getStores = async () => {
  if (deliveryInfo.department == null) return;

  isLoadingDeliveryOptions.value = true;

  let url = `/stores/get?department=${deliveryInfo.department.id}`;
  if (deliveryInfo.district) {
    url += `&district=${deliveryInfo.district.id}`;
  }

  const response = await sanctumFetch<Store[]>(url, {
    method: 'GET',
  });

  stores.value = response;

  isLoadingDeliveryOptions.value = false;

  if (districts.value.length === 0) {
    districts.value = Array.from(
      new Map(response.map(item => [item.district.id, item.district])).values()
    );
  }
}

const getDeliveryOptions = async () => {
  if (deliveryInfo.district == null) return;

  isLoadingDeliveryOptions.value = true;
  showAlertDeliveryOptionEmpty.value = false;

  const response = await sanctumFetch<DeliveryOption[]>(`/delivery-zone/get-by-district/${deliveryInfo.district.id}`, {
    method: 'GET',
  });

  deliveryOptions.value = response;

  isLoadingDeliveryOptions.value = false;

  if (deliveryOptions.value.length === 0) {
    showAlertDeliveryOptionEmpty.value = true;
  }
}

const onSelectStore = (store: Store) => {
  deliveryInfo.store = store;
  deliveryInfo.district = store.district;
}

const clearErrors = () => {
  errors.department = undefined;
  errors.province = undefined;
  errors.district = undefined;
  errors.store = undefined;
  errors.address = undefined;
  errors.delivery_option = undefined;
  errors.document_type = undefined;
  errors.document_number = undefined;
  errors.name = undefined;
  errors.phone = undefined;
}

const onSaveDeliveryInfo = async () => {
  clearErrors();

  if (deliveryInfo.department == null) {
    errors.department = 'Selecciona un departamento';
  }
  if (deliveryInfo.district == null) {
    errors.district = 'Selecciona un distrito';
  }
  if (deliveryInfo.method == 'pickup') {
    if (!deliveryInfo.store) {
      errors.store = 'Selecciona una opción de retiro..';
    }
  }

  if (deliveryInfo.method == 'delivery') {
    if (!deliveryInfo.address) {
      errors.address = 'Ingresa una dirección';
    }
    if (!deliveryInfo.delivery_option) {
      errors.delivery_option = 'Selecciona una opción de envío.';
    }
  }

  if (!deliveryInfo.document_type) {
    errors.document_type = 'Selecciona un tipo de documento';
  }

  if (deliveryInfo.document_type == 'dni' && !regex().dni.test(deliveryInfo.document_number.trim())) {
    errors.document_number = 'Ingresa un número de documento válido'
  }

  if (!deliveryInfo.name.trim() || deliveryInfo.name.trim().length < 5) {
    errors.name = 'Ingresa un nombre válido'
  }

  if (!regex().phone.test(deliveryInfo.phone.trim())) {
    errors.phone = 'Ingresa un número de teléfono válido'
  }

  const hasErrors = Object.values(errors).some(error => error !== undefined);

  if (!hasErrors) {
    isLoading.value = true;

    try {
      await sanctumFetch(`/checkout/${cartId}/shipping-info`, {
        method: 'POST',
        body: getDeliveryTypePaylod(deliveryInfo),
      });

      emit('updateCurrentStep', 'billing_info');
      emit('updateCartData');
    } catch (error) {
      const err = useSanctumError<keyof DeliveryInfoErrors>(error);

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

const getDeliveryTypePaylod = (data: DeliveryInfo) => {
  return {
    "method": data.method,
    "district": data.district?.id,
    "address": data.address,
    "store": data.store?.id,
    "delivery_option": data.delivery_option?.id,
    "document_type": data.document_type,
    "document_number": data.document_number,
    "name": data.name,
    "phone": data.phone,
    "notes": data.notes,
  };
}

onMounted(() => {
  if (allowDelivery || allowPickup) {
    getDepartments();

    if (deliveryInfo.province && provinces.value.length == 0) {
      getProvinces();
    }

    if (deliveryInfo.department && districts.value.length == 0) {
      getDistricts();
      if (deliveryInfo.method === 'pickup') {
        getStores();
      } else {
        getDeliveryOptions();
      }
    }
  }
});
</script>

<style></style>