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
          <CardTitle class="text-2xl font-bold text-gray-900">¿Olvidaste tu contraseña?</CardTitle>
          <p class="text-gray-600 mt-2">Simplemente ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña que le permitirá elegir una nueva.</p>
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
                    <Input type="text" placeholder="tu@email.com" class="pl-10" v-bind="componentField" />
                  </div>
                </FormControl>
                <FormMessage class="text-red-600" />
              </FormItem>
            </FormField>

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
import { ArrowLeft, Loader2, Mail, XCircle } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import z from 'zod';

definePageMeta({
  middleware: ['sanctum:guest'],
});

const isLoading: Ref<boolean> = ref<boolean>(false);
const generalError = ref<string | null>(null);
const sanctumFetch = useSanctumClient();

const zodSchema = z.object({
  email: z.string({
    required_error: 'El correo es obligatorio',
    invalid_type_error: 'El correo debe ser un texto',
  }).email('El correo no tiene un formato válido'),
});

const schema = toTypedSchema(zodSchema);

type FormFields = keyof z.infer<typeof zodSchema>;

const { isFieldDirty, handleSubmit, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await sanctumFetch('/forgot-password', {
      method: 'POST',
      body: values
    });

    toast.info('Enlace de restablecimiento de contraseña enviado', {
      description: '¡Le hemos enviado por correo electrónico el enlace para restablecer su contraseña!'
    });
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