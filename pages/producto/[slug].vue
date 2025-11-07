<template>
  <LayoutAppContainer>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 py-4">
      <div class="space-y-4">
        <div class="w-full sm:w-auto">
          <Carousel class="relative w-full" @init-api="(val: any) => emblaMainApi = val">
            <CarouselContent>
              <CarouselItem v-for="(image, index) in product.images" :key="index">
                <div class="p-1 w-full flex items-center justify-center">
                  <img :src="image" :alt="product.name" class="size-[400px]">
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <Carousel class="relative w-full" @init-api="(val: any) => emblaThumbnailApi = val">
            <CarouselContent class="flex gap-1 ml-0">
              <CarouselItem v-for="(thumb, idx) in product.images_thumb" :key="idx"
                class="pl-0 basis-1/4 cursor-pointer" @click="onThumbClick(idx)">
                <div class="p-1" :class="idx === selectedIndex ? '' : 'opacity-50'">
                  <img :src="thumb" :alt="product.name">
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

      </div>

      <!-- Product Information -->
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          <p class="text-sm text-gray-600 mb-1.5">SKU: {{ selectedVariant.code }}</p>
          <p><strong>Stock disponible:</strong> {{ selectedVariant.current_stock }}</p>
          <p class="text-sm text-black my-1"><strong>Categoría: </strong>{{ product.category.name }}</p>
        </div>

        <!-- Pricing -->
        <div v-if="selectedVariant" class="space-y-2">
          <div class="flex items-center gap-3">
            <span
              v-if="selectedVariant.prices.alt_price.formatted != null && parseFloat(selectedVariant.prices.alt_price.formatted) > 0"
              class="text-sm text-gray-500 line-through">
              {{ selectedVariant.prices.alt_price.formatted }}
            </span>
            <span class="text-3xl font-bold text-blue-500">{{ selectedVariant.prices.price.formatted }}</span>
          </div>
        </div>
        <div v-else>
          <p class="text-lg text-gray-600">Selecciona las opciones para ver el precio</p>
        </div>

        <div v-for="option in product.product_options" :key="option.id">
          <h3 class="font-medium text-gray-900 mb-2">{{ option.name }}:</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="value in option.values" :key="value.id" @click="handleOptionChange(option.id, value.id)"
              :disabled="!isOptionAvailable(option.id, value.id)" :class="[
                'px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                selectedOptions[option.id] === value.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : isOptionAvailable(option.id, value.id)
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              ]">
              {{ value.name }}
            </button>
          </div>
        </div>

        <!-- Quantity and Add to Cart -->
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center border rounded select-none">
              <Button variant="ghost" size="sm" class="px-3" @click="handleQuantityChange(-1)"
                :disabled="quantity <= 1">
                <Minus class="w-4 h-4" />
              </Button>
              <Input type="number" v-model="quantity"
                class="w-16 text-center border-0 text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1" />
              <Button variant="ghost" size="sm" @click="handleQuantityChange(1)">
                <Plus class="w-4 h-4" />
              </Button>
            </div>
            <Button class="flex-1 bg-gray-600 hover:bg-gray-700" :disabled="!canAddToCart || isLoadingCart"
              @click="handleAddCart">
              <ShoppingCart class="w-4 h-4 mr-2" />
              {{ !canAddToCart
                ? "Producto agotado"
                : (!isLoadingCart ? "Añadir al carrito" : 'Añadiendo al carrito...')
              }}
            </Button>
          </div>
        </div>

        <div v-if="product.attributes.length > 0" class="space-y-4 text-sm text-gray-600">
          <div class="not-prose overflow-auto rounded-lg bg-white">
            <div class="my-8 overflow-hidden">
              <table class="w-full table-auto border-collapse text-sm">
                <tbody class="bg-white">
                  <tr v-for="attribute in product.attributes">
                    <td class="border-b border-gray-100 p-4 text-gray-700">
                      {{ attribute.name }}
                    </td>
                    <td class="border-b border-gray-100 p-4 text-gray-700">
                      {{ attribute.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div class="space-y-4 text-sm text-gray-600">
          <p>
            <strong>¿Deseas acceder a nuestros precios mayoristas?</strong> Contáctanos ahora y un asesor te
            atenderá de inmediato.
          </p>
          <Button variant="outline" class="w-full">
            Contacta a un asesor de ventas
          </Button>
          <p class="text-center">
            <strong>CONSULTAR DISPONIBILIDAD ANTES DE VISITAR NUESTRA TIENDA FÍSICA.</strong>
          </p>
        </div>
      </div>
    </div>
    <div class="">
      <Tabs defaultValue="details" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
          <TabsTrigger value="warranty">Garantía</TabsTrigger>
        </TabsList>

        <TabsContent value="details" class="mt-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Descripción del Producto</h3>
              <div class="text-gray-700 prose max-w-none" v-html="product.description"></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compatibility" class="mt-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Compatibilidad</h3>
              <div class="text-gray-700 prose max-w-none" v-html="product.compatibility"></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="warranty" class="mt-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de Garantía</h3>
              <div class="text-gray-700 prose max-w-none" v-html="product.warranty"></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </LayoutAppContainer>

  <section>
    <LayoutAppContainer class="mb-10">
      <AppTitle>Productos Relacionados</AppTitle>
      <Carousel :opts="{
        align: 'start',
        loop: true,
      }" :plugins="[Autoplay({
        delay: 2000,
      })]">
        <CarouselContent>
          <CarouselItem v-for="n in 8" class="basis-full sm:basis-1/2 md:bases-1/3 lg:basis-1/5">
            <AppProductItem :product="productExample" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </LayoutAppContainer>
  </section>

  <Dialog v-model:open="storesDialogShow">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-xl font-bold"></DialogTitle>
      </DialogHeader>

      <div class="space-y-4 mt-4">
        <div v-for="store in stores" key="store.id" class="border rounded-lg p-4 transition-all cursor-pointer"
          :class="{ 'border-blue-500 bg-blue-50': selectedStore?.id === store.id }" @click="setSelectedStore(store)">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin class="w-6 h-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ store.name }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ store.address }}</p>
                  <p class="text-sm text-gray-500">
                    {{ store.district.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6 pt-4 border-t">
        <Button class="w-full" @click="handleSetStore" :disabled="!selectedStore || isLoadingSetStore">
          <div v-if="isLoadingSetStore" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
          </div>
          <div v-else>Continuar</div>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Loader2, MapPin, Minus, Plus, ShoppingCart } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { watchOnce } from '@vueuse/core';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay';
import type { ProductItem } from '@/types/product';
import type { Product, Variant } from '@/types/pages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Store } from '@/types/checkout';

const { addToCart, hasStore, updateStore, store } = useCartStore();
const { getStores } = useStoreStore();
const sanctumFetch = useSanctumClient();

const storesDialogShow: Ref<boolean> = ref<boolean>(false);
const stores: Ref<Store[]> = ref<Store[]>([]);
const selectedStore: Ref<Store | null> = ref<Store | null>(null);
const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);
const isLoadingCart: Ref<boolean> = ref<boolean>(false);
const isLoadingSetStore: Ref<boolean> = ref<boolean>(false);

const route = useRoute()
const productSlug = route.params.slug as string;

const data = await sanctumFetch<Product>(`/api/product/${productSlug}`, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(store ? { 'X-Store-ID': String(store.id) } : {})
  }
});

const product: Product = reactive<Product>(data);
const quantity: Ref<number> = ref<number>(1);
const selectedOptions = reactive<Record<number, number>>({});
const selectedVariant: Ref<Variant> = ref<Variant>(product.has_variants && product.variants != null ? product.variants[0] : product.variant);

useHead({
  title: product.name,
});

const handleQuantityChange = (change: number) => {
  const newQuantity = quantity.value + change;
  if (newQuantity >= 1) {
    quantity.value = newQuantity;
  }
}

const canAddToCart = computed(() => selectedVariant.value && selectedVariant.value.stock_available);

const handleAddCart = async () => {
  isLoadingCart.value = true;
  await addToCart(selectedVariant.value.id, quantity.value);

  isLoadingCart.value = false;
}

watch(selectedOptions, () => {
  if (product.variants == null) return;

  const optionCount = Object.keys(selectedOptions).length
  const totalOptions = product.product_options.length

  if (optionCount === totalOptions) {
    const match = product.variants.find((variant) =>
      variant.values.every((v) => selectedOptions[v.option_id] === v.id)
    )
    selectedVariant.value = match ?? product.variants[0];
  } else {
    selectedVariant.value = product.variants[0];
  }
}, { deep: true });

const handleOptionChange = (optionId: number, valueId: number): void => {
  selectedOptions[optionId] = valueId
}

const isOptionAvailable = (optionId: number, valueId: number): boolean => {
  if (product.variants == null) return false;

  const temp = { ...selectedOptions, [optionId]: valueId }

  if (Object.keys(temp).length < product.product_options.length) {
    return true
  }

  return product.variants.some((variant) =>
    variant.values.every(v => temp[v.option_id] === v.id)
  )
}

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value)
    return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value)
    return
  emblaMainApi.value.scrollTo(index)
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi)
    return

  onSelect()
  emblaMainApi.on('select', onSelect)
  emblaMainApi.on('reInit', onSelect)
});

const setSelectedStore = (store: Store) => {
  selectedStore.value = store;
}

const handleSetStore = async () => {
  if (!selectedStore.value) return;

  isLoadingSetStore.value = true;

  await updateStore(selectedStore.value);

  storesDialogShow.value = false;
  isLoadingSetStore.value = false;

  window.location.reload();
}

const productExample: ProductItem = {
  id: '1',
  slug: 'test',
  name: 'Producto de Prueba',
  brand: {
    name: 'Marca',
    slug: 'marca'
  },
  prices: {
    currency: 'PEN',
    price: {
      decimal: '20.00',
      formatted: 'S/ 20.00'
    },
    alt_price: {
      decimal: '20.00',
      formatted: 'S/ 20.00'
    }
  },
  image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
  is_new: false,
  has_discount: false,
}
</script>

<style></style>