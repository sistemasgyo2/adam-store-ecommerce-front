<template>
  <form @submit="onSubmit" class="space-y-6">

    <Alert v-if="generalError" variant="destructive">
      <XCircle class="h-4 w-4" />
      <AlertDescription>{{ generalError }}</AlertDescription>
    </Alert>

    <Alert v-if="token">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>¡Tu contraseña ha sido restablecida!</AlertTitle>
    </Alert>

    <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Correo Electrónico</FormLabel>
        <FormControl>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="tu@email.com" class="pl-10" v-bind="componentField" />
          </div>
        </FormControl>
        <FormMessage class="text-red-600" />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Contraseña</FormLabel>
        <FormControl>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña" class="pl-10"
              v-bind="componentField" />
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

    <FormField v-slot="{ value, handleChange }" type="checkbox" name="remember" :validate-on-blur="!isFieldDirty">
      <FormItem class="flex items-center justify-between">
        <FormControl>
          <div class="flex items-center space-x-2">
            <Checkbox :model-value="value" @update:model-value="handleChange" />
            <FormLabel>Recordarme</FormLabel>
          </div>
          <FormMessage class="text-red-600" />
        </FormControl>
        <NuxtLink to="/forgot-password" class="p-0 h-auto text-sm text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full" :disabled="isLoading">
      <div v-if="isLoading" class="flex items-center gap-2">
        <Loader2 class="w-4 h-4 animate-spin" />
        Iniciando sesión...
      </div>
      <div v-else>Iniciar Sesión</div>
    </Button>
  </form>
</template>

<script lang="ts" setup>
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, XCircle } from 'lucide-vue-next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const props = defineProps({
  redirectCheckout: {
    type: String,
    default: 'page',
  }
});

const showPassword: Ref<boolean> = ref<boolean>(false);

const isLoading: Ref<boolean> = ref<boolean>(false);

const route = useRoute();
const token = route.query.reset as string | undefined;
const generalError = ref<string | null>(null);

const { setLoginOrigin } = useLoginOrigin();
const { login } = useSanctumAuth();

const zodSchema = z.object({
  email: z.string({
    required_error: 'El correo es obligatorio',
    invalid_type_error: 'El correo debe ser un texto',
  }).email('El correo no tiene un formato válido'),

  password: z.string({
    required_error: 'La contraseña es obligatoria',
  }).min(6, 'La contraseña debe tener al menos 6 caracteres'),

  remember: z.boolean().optional(),
});

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    remember: false,
  },
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  setLoginOrigin(props.redirectCheckout); 

  try {
    await login(values)
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
</script>

<style></style>