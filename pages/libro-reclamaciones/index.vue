<template>
  <div v-if="!isSubmitted" class="w-full py-6">
    <LayoutAppContainer>
      <div class="flex flex-col space-y-2">
        <h1 class="text-3xl font-bold mb-6">Libro de Reclamaciones</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Label class="text-sm font-medium text-gray-700">RUC</Label>
            <div class="mt-1 p-1.5 bg-white border rounded-md">
              <span class="text-gray-900">{{ companyData?.ruc }}</span>
            </div>
          </div>
          <div>
            <Label class="text-sm font-medium text-gray-700">RAZÓN SOCIAL</Label>
            <div class="mt-1 p-1.5 bg-white border rounded-md">
              <span class="text-gray-900">{{ companyData?.business_name }}</span>
            </div>
          </div>
          <div class="md:col-span-2">
            <Label class="text-sm font-medium text-gray-700">DIRECCIÓN FISCAL</Label>
            <div class="mt-1 p-1.5 bg-white border rounded-md">
              <span class="text-gray-900">
                {{ companyData?.address }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-8">
        <Alert v-if="generalError" variant="destructive">
          <XCircle class="h-4 w-4" />
          <AlertDescription>{{ generalError }}</AlertDescription>
        </Alert>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField v-slot="{ componentField }" name="document_type" class="space-y-2"
              :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Tipo de Documento <span class="text-red-500">*</span></FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="type in documentTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="document_number" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Documento <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="documentNumber" placeholder="Número de documento" v-bind="componentField"
                    @input="onNumberInput" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Nombre <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Nombre completo" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Teléfono <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="phone" placeholder="999 999 999" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Correo Electrónico <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="email" type="email" placeholder="tu@email.com" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="address" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Dirección <span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input id="address" placeholder="Dirección completa" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">IDENTIFICACIÓN DEL BIEN CONTRATADO</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField v-slot="{ componentField }" name="complaint_type" class="space-y-2"
              :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Tipo de Reclamo <span class="text-red-500">*</span></FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="type in complaintTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="consumption_type" class="space-y-2"
              :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Tipo de Consumo <span class="text-red-500">*</span></FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="type in consumptionTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="claimed_amount" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Monto Reclamado S/ <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="claimedAmount" placeholder="0.00" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="order_number" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel># de Orden <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="orderNumber" placeholder="Número de orden" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR
          </h3>

          <FormField v-slot="{ componentField }" name="complaint_details" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Detalle de la Reclamación y Pedido del Consumidor <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea id="complaintDetails"
                  placeholder="Describe detalladamente tu reclamo y lo que solicitas como solución..."
                  v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-red-600" />
            </FormItem>
          </FormField>
        </div>

        <Alert>
          <AlertCircle class="h-4 w-4" />
          <AlertDescription class="flex">
            <span class="text-red-500">*</span> Datos Obligatorios
          </AlertDescription>
        </Alert>

        <div class="text-sm space-y-2">
          <p><strong>RECLAMO</strong> Disconformidad relacionada a los productos o servicios.</p>
          <p><strong>QUEJA</strong> Disconformidad no relacionada a los productos o servicios; o, malestar o
            descontento respecto a la atención al público.</p>
          <p>La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito
            previo para interponer una
            denuncia ante el INDECOPI.</p>
          <p>El proveedor deberá dar respuesta al reclamo en un plazo no mayor a treinta (30) días calendario,
            pudiendo ampliar el plazo
            hasta por treinta (30) días más, previa comunicación al consumidor. </p>
          <p style="font-weight: bold; font-style: italic;">
            "Declaro bajo juramento que la información proporcionada en este formulario es veraz y corresponde a
            mi reclamo o queja. Asimismo, confirmo que he leído y acepto los
            <NuxtLink to="/terminos-condiciones" class="text-primary hover:underline" target="_blank">Términos
              y Condiciones</NuxtLink>. Al enviar este
            formulario, otorgo mi consentimiento para el tratamiento de
            mis datos personales conforme a la normativa vigente. <br>
            Autorizo expresamente al proveedor a contactarme durante y después del proceso de atención de mi
            reclamo o queja, a través de los medios de contacto proporcionados, con el propósito de brindarme
            información sobre el estado de mi solicitud y cualquier otra comunicación relacionada."
          </p>
        </div>

        <FormField v-slot="{ value, handleChange }" type="checkbox" name="terms">
          <FormItem class="flex flex-row items-start gap-x-3 space-y-0">
            <FormControl>
              <Checkbox :model-value="value" @update:model-value="handleChange" />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel class="gap-0.5">Acepto los
                <NuxtLink to="/page/terminos-condiciones" target="_blank" class="text-blue-600 hover:underline">
                  términos y condiciones
                </NuxtLink>
                , y confirmo que la información ingresada es veráz.
              </FormLabel>
              <FormMessage class="text-red-600" />
            </div>
          </FormItem>
        </FormField>

        <div class="flex justify-center">
          <Button type="submit" size="lg" :disabled="isLoading" class="min-w-[200px]">
            <div v-if="isLoading" class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </div>
            <div v-else class="flex items-center gap-2">
              <Send class="w-4 h-4" />
              Enviar Reclamo
            </div>
          </Button>
        </div>
      </form>
    </LayoutAppContainer>
  </div>
  <div v-else class="w-full py-6">
    <LayoutAppContainer>
      <div class="max-w-2xl mx-auto">
        <Card class="shadow-none">
          <CardContent class="p-8 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText class="w-8 h-8 text-green-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">¡Reclamo Registrado!</h2>
            <p class="text-gray-600 mb-6">
              Tu reclamo ha sido registrado exitosamente en nuestro Libro de Reclamaciones. Recibirás una respuesta
              en un plazo máximo de 30 días calendario. Te enviaremos un correo electrónico con el detalle de tu reclamo.
            </p>
            <div class="space-y-3">
              <Button asChild class="w-full">
                <NuxtLink to="/">Volver al Inicio</NuxtLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutAppContainer>
  </div>
</template>

<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toTypedSchema } from '@vee-validate/zod';
import { computedAsync } from '@vueuse/core';
import { AlertCircle, FileText, Send, XCircle } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import z from 'zod';

const generalError = ref<string | null>(null);
const isLoading: Ref<boolean> = ref<boolean>(false);
const isSubmitted: Ref<boolean> = ref<boolean>(false);

const sanctumFetch = useSanctumClient();

const { companyData } = useLayoutStore();

const documentTypes = [
  { value: "dni", label: "DNI" },
  { value: "carnet_extranjeria", label: "Carnet de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
];

const complaintTypes = [
  { value: "reclamo", label: "Reclamo" },
  { value: "queja", label: "Queja" },
];

const consumptionTypes = [
  { value: "producto", label: "Producto" },
  { value: "servicio", label: "Servicio" },
];

const zodSchema = z.object({
  document_type: z.string({
    required_error: 'El tipo de documento es obligatorio',
    invalid_type_error: 'El tipo de documento debe ser texto',
  }),

  document_number: z.string({
    required_error: 'El número de documento es obligatorio',
    invalid_type_error: 'El número de documento solo debe contener dígitos',
  }).regex(/^\d+$/, 'El número de documento solo debe contener dígitos'),

  name: z.string({
    required_error: 'El nombre es obligatorio',
    invalid_type_error: 'El nombre debe ser texto',
  }).min(2, 'El nombre debe tener al menos 2 caracteres'),

  phone: z.string({
    required_error: 'El teléfono es obligatorio',
    invalid_type_error: 'Debe ser texto',
  }).min(9, 'El teléfono debe tener al menos 9 dígitos'),

  email: z.string({
    required_error: 'El correo es obligatorio',
    invalid_type_error: 'El correo debe ser texto',
  }).email('El correo no tiene un formato válido'),

  address: z.string({
    required_error: 'La dirección es obligatoria',
    invalid_type_error: 'Debe ser texto',
  }).min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no debe tener más de 200 caracteres'),

  complaint_type: z.string({
    required_error: 'Debe seleccionar un tipo de reclamo',
  }),

  consumption_type: z.string({
    required_error: 'Debe seleccionar un tipo de consumo',
  }),

  claimed_amount: z.string({
    required_error: 'El monto reclamado es obligatorio',
  }).refine((val) => !isNaN(parseFloat(val)), {
    message: 'Ingrese un monto válido',
  }),

  order_number: z.string({
    required_error: 'El número de orden es obligatorio',
  }),

  complaint_details: z.string({
    required_error: 'Debe ingresar el detalle del reclamo',
  }).min(10, 'El detalle debe tener al menos 10 caracteres'),

  terms: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar los términos y condiciones' }),
  }),
})
  .refine(
    (data) => {
      // Si el tipo de documento es DNI, debe tener exactamente 8 dígitos
      if (data.document_type === 'dni') {
        return data.document_number.length === 8;
      }
      return true; // Para otros tipos, no validar longitud
    },
    {
      message: "El DNI debe tener exactamente 8 dígitos",
      path: ["document_number"],
    }
  );

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors, values } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  console.log(values);

  isLoading.value = true;
  try {
    await sanctumFetch('/compliant-book/store', {
      method: 'POST',
      body: values
    });

    isSubmitted.value = true;
  }
  catch (error) {
    const err = useSanctumError<FormFields>(error);

    if (err.isValidationError) {
      setErrors(err.fieldErrors)
    } else if (err.generalMessage) {
      generalError.value = err.generalMessage
    }
  }
  finally {
    isLoading.value = false;
  }

});

const onNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  values.document_number = input.value
}

useHead({
  title: 'Libro de Reclamaciones',
});
</script>

<style></style>