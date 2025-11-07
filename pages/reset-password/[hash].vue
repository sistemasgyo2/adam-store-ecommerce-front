<template>
  <div class="bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <NuxtLink href="/">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Volver al inicio
          </NuxtLink>
        </Button>
      </div>

      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-bold text-gray-900">Restablece tu contraseña</CardTitle>
          <p class="text-gray-600 mt-2">Ingresa tu nueva contraseña.</p>
        </CardHeader>

        <CardContent class="p-6">
          <form @submit="onSubmit" class="space-y-6">

            <Alert v-if="generalError" variant="destructive">
              <XCircle class="h-4 w-4" />
              <AlertDescription>{{ generalError }}</AlertDescription>
            </Alert>

            <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input type="text" placeholder="tu@email.com" class="pl-10 bg-slate-100" v-bind="componentField"
                      readonly />
                  </div>
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

            <div class="space-y-2">
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

              <div v-if="values.password" class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div :class="`h-2 rounded-full transition-all duration-300 ${getPasswordStrength.color}`"
                      :style="`width: ${(getPasswordStrength.strength / 5) * 100}%`" />
                  </div>
                  <span class="text-xs font-medium text-gray-600">{{ getPasswordStrength.text }}</span>
                </div>
                <div class="text-xs text-gray-500 space-y-1">
                  <p class="flex items-center gap-1">
                    <CheckCircle v-if="values.password.length >= 6" class="w-3 h-3 text-green-500" />
                    <XCircle v-else class="w-3 h-3 text-gray-400" />
                    Al menos 6 caracteres
                  </p>
                  <p class="flex items-center gap-1">
                    <CheckCircle v-if="/(?=.*[a-z])(?=.*[A-Z])/.test(values.password)" class="w-3 h-3 text-green-500" />
                    <XCircle v-else class="w-3 h-3 text-gray-400" />
                    Mayúsculas y minúsculas
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input :type="showPassword ? 'text' : 'password'" placeholder="Confirma tu contraseña"
                        class="pl-10" v-bind="componentField" />
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

              <div v-if="values.password_confirmation" class="flex items-center gap-2 text-xs">
                <div v-if="values.password === values.password_confirmation" class="flex gap-2 items-center">
                  <CheckCircle class="w-3 h-3 text-green-500" />
                  <span class="text-green-600">Las contraseñas coinciden</span>
                </div>
                <div v-else class="flex gap-2 items-center">
                  <XCircle class="w-3 h-3 text-red-500" />
                  <span class="text-red-600">Las contraseñas no coinciden</span>
                </div>
              </div>
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading">
              <div v-if="isLoading" class="flex items-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                Enviando...
              </div>
              <div v-else>Restablecer contraseña</div>
            </Button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <NuxtLink to="/register" class="text-blue-600 hover:underline font-medium">
                Regístrate aquí
              </NuxtLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, XCircle } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import z from 'zod';

definePageMeta({
  middleware: ['sanctum:guest'],
})

useSeoMeta({
  title: 'Reset password',
})

const route = useRoute();

const email = (route.query.email ?? '') as string;
const resetToken = route.params.hash as string;

const sanctumFetch = useSanctumClient();

const showPassword = ref(false);
const isLoading: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);

const zodSchema = z.object({
  email: z.string({
    required_error: 'El correo es obligatorio',
    invalid_type_error: 'El correo debe ser un texto',
  }).email('El correo no tiene un formato válido'),

  password: z.string({
    required_error: 'La contraseña es obligatoria',
  })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/(?=.*[a-z])(?=.*[A-Z])/, 'Debe contener mayúsculas y minúsculas')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo'),

  password_confirmation: z.string({
    required_error: 'La confirmación es obligatoria',
  }),

  token: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: 'Las contraseñas no coinciden',
})

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors, values } = useForm({
  validationSchema: schema,
  initialValues: {
    email: email,
    password: '',
    password_confirmation: '',
    token: resetToken,
  },
});

const getPasswordStrength = computed(() => {
  const password = values.password
  if (!password) return { strength: 0, text: '', color: '' }

  let strength = 0
  const checks = [
    password.length >= 6,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]

  strength = checks.filter(Boolean).length

  if (strength <= 2) return { strength, text: 'Débil', color: 'bg-red-500' }
  if (strength <= 3) return { strength, text: 'Media', color: 'bg-yellow-500' }
  if (strength <= 4) return { strength, text: 'Fuerte', color: 'bg-green-500' }
  return { strength, text: 'Muy Fuerte', color: 'bg-green-600' }
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await sanctumFetch('/reset-password', {
      method: 'POST',
      body: values,
    });

    await navigateTo({ path: '/login', query: { reset: 'true' } })
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