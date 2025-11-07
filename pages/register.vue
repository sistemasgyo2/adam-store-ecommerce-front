<template>
  <div class="bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Volver al inicio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-bold text-gray-900">Crear Cuenta</CardTitle>
        </CardHeader>

        <CardContent class="p-6">
          <form @submit.prevent="onSubmit" class="space-y-6">
            <Alert v-if="generalError" variant="destructive">
              <XCircle class="h-4 w-4" />
              <AlertDescription>{{ generalError }}</AlertDescription>
            </Alert>

            <div class="space-y-2">
              <Label for="name">Nombre Completo</Label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="name" type="text" placeholder="Ingresa tu nombre completo" v-model="form.fields.name" class="pl-10"
                  required />
              </div>
              <p v-if="form.errors.name" class="text-sm text-red-600 -mt-2">{{ form.errors.name[0] }}</p>
            </div>

            <div class="space-y-2">
              <Label for="email">Correo Electrónico</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="email" type="email" placeholder="tu@email.com" class="pl-10" v-model="form.fields.email" required />
              </div>
              <p v-if="form.errors.email" class="text-sm text-red-600 -mt-2">{{ form.errors.email[0] }}</p>
            </div>

            <div class="space-y-2">
              <Label for="password">Contraseña</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="password" :type="showPassword ? 'text' : 'password'" class="pl-10"
                  placeholder="Crea una contraseña segura" v-model="form.fields.password" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="form.errors.password" class="text-sm text-red-600 -mt-2">{{ form.errors.password[0] }}</p>

              <div v-if="form.fields.password" class="space-y-2">
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
              <Label for="confirmPassword">Confirmar Contraseña</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="confirmPassword" :type="showPassword ? 'text' : 'password'"
                  v-model="form.fields.password_confirmation" placeholder="Confirma tu contraseña" class="pl-10" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>

              <p v-if="form.errors.password_confirmation" class="text-sm text-red-600 -mt-2">{{ form.errors.password_confirmation }}</p>

              <div v-if="form.fields.password_confirmation" class="flex items-center gap-2 text-xs">
                <div v-if="form.fields.password === form.fields.password_confirmation" class="flex gap-2 items-center">
                  <CheckCircle class="w-3 h-3 text-green-500" />
                  <span class="text-green-600">Las contraseñas coinciden</span>
                </div>
                <div v-else class="flex gap-2 items-center">
                  <XCircle class="w-3 h-3 text-red-500" />
                  <span class="text-red-600">Las contraseñas no coinciden</span>
                </div>
              </div>
            </div>


            <div class="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" v-model="form.fields.term" />
              <span @click="form.fields.term = !form.fields.term"
                class="text-sm text-gray-600 cursor-pointer leading-relaxed select-none">
                Acepto los
                <NuxtLink to="/page/terminos-condiciones" target="_blank" class="text-blue-600 hover:underline">
                  términos y condiciones
                </NuxtLink>
                y las
                <NuxtLink href="/page/politica-de-cambios-reembolsos-y-devoluciones" target="_blank"
                  class="text-blue-600 hover:underline">
                  políticas de cambios, reembolsos y devoluciones
                </NuxtLink>
              </span>
            </div>
            <p v-if="form.errors.term" class="text-sm text-red-600 -mt-2">{{ form.errors.term[0] }}</p>

            <Button type="submit" class="w-full" :disabled="isLoading || !form.fields.term">
              <div v-if="isLoading" class="flex items-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                Creando cuenta...
              </div>
              <div v-else>Crear Cuenta</div>
            </Button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta?
              <NuxtLink href="/login" class="text-blue-600 hover:underline font-medium">
                Inicia sesión aquí
              </NuxtLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User, XCircle } from 'lucide-vue-next';

const showPassword = ref(false);
const isLoading = ref(false);
const generalError = ref<string | null>(null)

const sanctumConfig = useSanctumConfig()
const { refreshIdentity } = useSanctumAuth()

type RegisterForm = {
  name: string
  email: string
  password: string
  password_confirmation: string
  term: boolean
}

const form = usePrecognitionForm<RegisterForm>('post', '/register', {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  term: false,
})

const values = form.fields
const errors = form.errors

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
})

const onSubmit = async () => {
  generalError.value = null
  isLoading.value = true

  try {
    await form.submit()
    await refreshIdentity()
    navigateTo(sanctumConfig.redirect.onGuestOnly || '/')
  } catch (error: any) {
    if (error?.data?.message) {
      generalError.value = error.data.message
    }
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Registro',
});

definePageMeta({
  middleware: ['sanctum:guest'],
});
</script>
<style></style>