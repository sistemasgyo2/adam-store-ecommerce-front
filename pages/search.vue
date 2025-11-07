<template>
  <LayoutAppContainer class="py-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Filters -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Categories -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Categorías</h3>
          <div class="space-y-3">
            <div v-for="category in categories" :key="category.id" class="flex items-center space-x-2">
              <Checkbox :id="category.id" :checked="selectedCategories.includes(category.id)" :onCheckedChange="(checked: boolean) =>
                handleCategoryChange(category.id, checked as boolean)" />
              <label :for="category.id" class="text-sm text-gray-700 cursor-pointer">
                {{ category.name }}
              </label>
            </div>
          </div>
        </div>

        <!-- Price Range -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Precio</h3>
          <div class="space-y-4">
            <Slider :default-value="priceRange" :max="1000" :min="0" :step="10"
              class="w-full" />

            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>S/ {{ priceRange[0] }}.00</span>
              <span>S/ {{ priceRange[1] }}.00</span>
            </div>
            <Button class="w-full">Filtrar</Button>
          </div>
        </div>

        <!-- Featured Brands -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Marcas</h3>
          <div class="space-y-3">

            <div v-for="brand in brands" :key="brand.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox />
                <label :for="brand.id" class="text-sm text-gray-700 cursor-pointer">
                  {{ brand.name }}
                </label>
              </div>
              <span class="text-xs text-gray-500">({{ brand.count }})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-3">
        <!-- Header -->
        <div class="bg-white mb-6 flex flex-col md:flex-row items-start md:justify-between md:items-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Cargadores</h1>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <Select :value="sortBy">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Orden predeterminado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Orden predeterminado</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div class="flex rounded gap-1.5">
                <Button :variant="viewMode === 'grid' ? 'default' : 'ghost'" size="sm" @click="viewMode = 'grid'">
                  <Grid2X2 className="w-4 h-4" />
                </Button>
                <Button :variant="viewMode === 'list' ? 'default' : 'ghost'" size="sm" @click="viewMode = 'list'">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AppProductItem v-for="product in products" />
        </div>
      </div>
    </div>
  </LayoutAppContainer>
</template>

<script lang="ts" setup>
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid2X2, List } from 'lucide-vue-next';

const sortBy: Ref<string> = ref<string>('default');
const viewMode: Ref<"grid" | "list"> = ref<"grid" | "list">('grid');
const priceRange: Ref<number[]> = ref<number[]>([40, 940])
const selectedCategories: Ref<string[]> = ref<string[]>([]);

interface Product {
  id: string
  title: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  isOnSale: boolean
  isSoldOut: boolean
  slug: string
}

interface Category {
  id: string
  name: string
  count?: number
}

interface Brand {
  id: string
  name: string
  count: number
}

const categories: Category[] = [
  { id: "home-audio", name: "Home Audio & Theater" },
  { id: "tv-video", name: "TV & Video" },
  { id: "camera", name: "Camera, Photo & Video" },
  { id: "cell-phones", name: "Cell Phones & Accessories" },
  { id: "headphones", name: "Headphones" },
  { id: "video-games", name: "Video Games" },
  { id: "bluetooth", name: "Bluetooth & Wireless Speakers" },
  { id: "gaming-console", name: "Gaming Console" },
]

const brands: Brand[] = [
  { id: "apple", name: "Apple", count: 417 },
  { id: "acer", name: "Acer", count: 79 },
  { id: "asus", name: "Asus", count: 283 },
  { id: "samsung", name: "Samsung", count: 116 },
  { id: "lg", name: "LG", count: 29 },
  { id: "electrolux", name: "Electrolux", count: 179 },
  { id: "toshiba", name: "Toshiba", count: 38 },
]

const products: Product[] = [
  {
    id: "1",
    title: "CARGADOR GENÉRICO 5V 2A / 12V 3A / 15V 3A / 20V 2A / 20V 3.25A 65W TIPO C RECTANGULAR",
    brand: "ACER",
    price: 218.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger1",
    isOnSale: true,
    isSoldOut: true,
    slug: "cargador-generico-5v",
  },
  {
    id: "2",
    title: "CARGADOR HUAWEI 5V 2A / 12V 3A / 15V 3A / 20V 2A / 20V 3.25A 65W TIPO C CUADRADO BLANCO",
    brand: "ACER",
    price: 183.0,
    originalPrice: 250.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger2",
    isOnSale: true,
    isSoldOut: false,
    slug: "cargador-huawei-5v",
  },
  {
    id: "3",
    title: "CARGADOR PARA ACER // MSI 19.5V 16.92A 330W 5.5*1.7",
    brand: "ACER",
    price: 218.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger3",
    isOnSale: true,
    isSoldOut: false,
    slug: "cargador-acer-msi",
  },
  {
    id: "4",
    title: "CARGADOR PARA ACER 19.5V 11.8A 230W 5.5*2.5 PUNTA TOSHIBA",
    brand: "ACER",
    price: 123.0,
    originalPrice: 180.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger4",
    isOnSale: true,
    isSoldOut: false,
    slug: "cargador-acer-toshiba",
  },
  {
    id: "5",
    title: "CARGADOR PARA ACER 19.5V 6.92A 135W 5.5*1.7 PUNTA MORADA",
    brand: "ACER",
    price: 133.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger5",
    isOnSale: true,
    isSoldOut: true,
    slug: "cargador-acer-morada",
  },
  {
    id: "6",
    title: "CARGADOR PARA ACER 19.5V 9.23A 180W 5.5*1.7",
    brand: "ACER",
    price: 133.0,
    image: "/placeholder.svg?height=200&width=200&text=Charger6",
    isOnSale: true,
    isSoldOut: false,
    slug: "cargador-acer-180w",
  },
];

const handleCategoryChange = (categoryId: string, checked: boolean) => {
  if (checked) {
    selectedCategories.value = ([...selectedCategories.value, categoryId])
  } else {
    selectedCategories.value = (selectedCategories.value.filter((id) => id !== categoryId))
  }
}
</script>

<style></style>