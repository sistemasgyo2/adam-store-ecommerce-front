<template>
  <div class="space-y-6">
    <Alert v-if="generalError" variant="destructive">
      <XCircle class="h-4 w-4" />
      <AlertDescription>{{ generalError }}</AlertDescription>
    </Alert>
    <form @submit="onSubmit" class="space-y-4">
      <div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
        <div class="sm:col-span-2">
          <FormField v-slot="{ componentField }" name="document_type">
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Seleccionar tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ruc">RUC</SelectItem>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="carnet_extranjeria">Carnet de Extranjería</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-2">
          <FormField v-slot="{ componentField }" name="document_number" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input id="document_number" v-bind="componentField"
                  :placeholder="values.document_type === 'dni' ? '12345678' : (values.document_type === 'ruc' ? '20123456789' : '001234567')"
                  :maxLength="values.document_type === 'dni' ? 8 : (values.document_type === 'ruc' ? 11 : 12)"
                  class="w-full" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-6">
          <FormField v-slot="{ componentField }" name="business_name" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input id="business_name" v-bind="componentField" class="w-full" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>
        <div class="sm:col-span-6">
          <FormField v-slot="{ componentField }" name="business_address" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input id="business_address" v-bind="componentField" class="w-full" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>
        <div class="sm:col-span-3">
          <FormField v-slot="{ componentField }" name="business_phone" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input id="business_phone" v-bind="componentField" class="w-full" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>
      </div>
      <Button type="submit" class="w-full" :disabled="isLoading">
        <div v-if="isLoading" class="flex items-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin" />
          Grabando...
        </div>
        <div v-else>Grabar</div>
      </Button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Button from '../ui/button/Button.vue';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, XCircle } from 'lucide-vue-next';
import { Input } from '../ui/input';
import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import type { Customer } from '@/types/user';
import { toast } from 'vue-sonner';

const isLoading: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);

const sanctumFetch = useSanctumClient();

const zodSchema = z.object({
  document_type: z.enum(['ruc', 'dni', 'carnet_extranjeria'], {
    errorMap: () => ({ message: 'Selecciona un tipo de documento válido' })
  }),
  document_number: z.string().min(1, 'El número de documento es obligatorio'),
  business_name: z.string().min(1, 'El nombre o razón social es obligatorio'),
  business_address: z.string().min(1, 'La dirección es obligatoria'),
  business_phone: z.string().optional(),
  other_contact: z.string().optional(),
}).refine((data) => {
  const { document_type, document_number } = data;
  if (document_type === 'dni') {
    return /^\d{8}$/.test(document_number);
  }
  if (document_type === 'ruc') {
    return /^\d{11}$/.test(document_number);
  }
  if (document_type === 'carnet_extranjeria') {
    return /^\d{9,12}$/.test(document_number);
  }
  return false;
}, {
  message: 'El número de documento no es válido para el tipo seleccionado',
  path: ['document_number'],
});

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors, values, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    document_type: 'dni',
    document_number: '',
    business_name: '',
    business_address: '',
    business_phone: '',
    other_contact: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  generalError.value = null;

  isLoading.value = true;
  try {
    await sanctumFetch('/account/update-info', {
      method: 'POST',
      body: values,
    });

    toast.success('Información actualizada correctamente');
  } catch (error) {
    const err = useSanctumError<FormFields>(error);

    if (err.isValidationError) {
      setErrors(err.fieldErrors)
    } else if (err.generalMessage) {
      generalError.value = err.generalMessage
    }
  } finally {
    isLoading.value = false;
  }
});

const getInfo = async () => {
  const data = await sanctumFetch<Customer>('/account/get-info', {
    method: 'get',
  });

  resetForm({
    values: {
      document_type: data.document_type ?? '',
      document_number: data.document_number ?? '',
      business_name: data.business_name ?? '',
      business_address: data.business_address ?? '',
      business_phone: data.business_phone ?? '',
      other_contact: data.other_contact ?? '',
    },
  });
}

onMounted(() => {
  getInfo();
});
</script>

<style></style>