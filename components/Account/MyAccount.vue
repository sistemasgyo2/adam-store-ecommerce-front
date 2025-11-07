<template>
  <div class="space-y-6">
    <Alert v-if="generalError" variant="destructive">
      <XCircle class="h-4 w-4" />
      <AlertDescription>{{ generalError }}</AlertDescription>
    </Alert>
    <form @submit="onSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel>Nombre Completo</FormLabel>
            <FormControl>
              <Input type="text" placeholder="tu@email.com" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-red-600" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel>Correo Electrónico</FormLabel>
            <FormControl>
              <Input type="text" placeholder="tu@email.com" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-red-600" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel>Contraseña</FormLabel>
            <FormControl>
              <div class="relative">
                <Input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña" v-bind="componentField" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </FormControl>
            <FormMessage class="text-red-600" />
          </FormItem>
        </FormField>
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
import type { User } from '@/types/user';
import Button from '../ui/button/Button.vue';
import { Eye, EyeOff, Loader2, XCircle } from 'lucide-vue-next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';

const props = defineProps<{
  user: User
}>();

const sanctumFetch = useSanctumClient();
const { refreshIdentity } = useSanctumAuth();

const showPassword: Ref<boolean> = ref<boolean>(false);
const isLoading: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);

const zodSchema = z.object({
  name: z.string({
    required_error: 'El nombre completo es obligatorio',
    invalid_type_error: 'El nombre completo debe ser un texto',
  }),

  email: z.string({
    required_error: 'El correo es obligatorio',
    invalid_type_error: 'El correo debe ser un texto',
  }).email('El correo no tiene un formato válido'),

  password: z.string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un símbolo')
  .optional(),
});

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.user.name,
    email: props.user.email,
  },
});

const onSubmit = handleSubmit(async (values) => {
  generalError.value = null;

  isLoading.value = true;
  try {
     await sanctumFetch('/account/update', {
      method: 'POST',
      body: values,
    });

    refreshIdentity();

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
</script>

<style></style>