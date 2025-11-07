<template>
  <footer v-if="footer" class="bg-gray-900 text-white py-8 px-4">
    <LayoutAppContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <Phone class="w-5 h-5 text-blue-500" />
              <h3 class="text-blue-500 font-semibold">Móvil de contacto</h3>
            </div>
            <p class="text-normal font-bold mb-2">{{ footer.data.phone }}</p>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <MapPin class="w-5 h-5 text-blue-500" />
              <h3 class="text-blue-500 font-semibold">Nuestras sedes</h3>
            </div>
            <p class="text-sm text-gray-300">
              {{ footer.data.address }}
            </p>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <Clock class="w-5 h-5 text-blue-500" />
              <h3 class="text-blue-500 font-semibold">Horarios de atención</h3>
            </div>
            <p class="text-sm text-gray-300">{{ footer.data.schedule }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <CreditCard class="w-5 h-5 text-blue-500" />
              <h3 class="text-white font-semibold">Tu Compra 100% Segura</h3>
            </div>

            <div class="bg-gray-800 rounded-lg p-4 mb-4">
              <div class="flex items-center justify-center mb-3">
                <!-- <Image src="/placeholder.svg?height=40&width=120" alt="MercadoPago" width={120} height={40}
                  class="opacity-70" /> -->
              </div>
              <p class="text-center text-sm text-gray-300 mb-3">Aceptamos todas las tarjetas!</p>
              <div class="flex justify-center gap-2">
                <div class="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div class="w-8 h-6 bg-gray-600 rounded"></div>
                <div class="w-8 h-6 bg-blue-800 rounded"></div>
                <div class="w-8 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <p class="text-center text-sm text-gray-300 mb-3">Transferencias Bancarias</p>
              <div class="flex justify-center gap-2 flex-wrap">
                <div class="w-8 h-6 bg-red-600 rounded text-xs flex items-center justify-center">BCP</div>
                <div class="w-8 h-6 bg-gray-600 rounded"></div>
                <div class="w-8 h-6 bg-green-600 rounded text-xs flex items-center justify-center">$</div>
                <div class="w-8 h-6 bg-blue-700 rounded"></div>
                <div class="w-8 h-6 bg-orange-600 rounded"></div>
                <div class="w-8 h-6 bg-purple-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-4">
            <Link class="w-5 h-5 text-blue-500" />
            <h3 class="text-white font-semibold">Enlaces Rápidos</h3>
          </div>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/page/terminos-condiciones" class="text-gray-300 hover:text-white hover:underline transition-colors">
                Términos y Condiciones
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/page/politica-de-cambios-reembolsos-y-devoluciones" class="text-gray-300 hover:text-white hover:underline transition-colors">
                Políticas de Cambios, Reembolsos y Devoluciones
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <Users class="w-5 h-5 text-blue-500" />
              <h3 class="text-white font-semibold">Síguenos en nuestras Redes</h3>
            </div>
            <div class="flex gap-3">
              <a v-for="link in footer.social" :key="link.platform" :href="link.url" target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.platform"
                class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <component :is="icons[link.platform] || icons.default" class="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <Mail class="w-5 h-5 text-blue-500" />
              <h3 class="text-white font-semibold">Correo de contacto</h3>
            </div>
            <a :href="`mailto:${footer.data.email}`" class="text-gray-300 hover:text-white hover:underline">{{
              footer.data.email }}</a>
          </div>

          <div class="text-center">
            <p class="text-blue-400 font-semibold mb-2">Libro de Reclamaciones</p>
            <div class="w-40 h-20 mx-auto bg-gray-600 rounded flex items-center justify-center p-2">
              <NuxtLink to="/libro-reclamaciones">
                <img src="~/assets/images/complaint_book.webp" alt="Libro de Reclamaciones" class="w-28 h-auto" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center flex flex-col md:flex-row justify-center md:justify-between items-center">
        <div class="text-sm text-gray-400">Copyright © {{ year }} {{ companyData?.business_name }}</div>
        <div class="text-sm text-gray-400">
           Desallorado por: GyO Soluciones Informáticas SAC
        </div>
      </div>
    </LayoutAppContainer>
  </footer>
</template>

<script lang="ts" setup>
import { Clock, CreditCard, Facebook, Globe, Instagram, Link, Mail, MapPin, Phone, Users, Youtube } from 'lucide-vue-next';

const layoutStore = useLayoutStore();
const { footer, companyData } = storeToRefs(layoutStore);
const year = new Date().getFullYear();

const icons = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  default: Globe,
}
</script>

<style></style>