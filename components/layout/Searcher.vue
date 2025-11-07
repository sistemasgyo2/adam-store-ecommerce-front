<template>
  <div class="relative w-full" ref="searchRef">
    <div class="relative w-full flex items-center">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search class="h-5 w-5 text-gray-400" />
      </div>

      <input ref="inputRef" type="text" placeholder="Buscar productos..." v-model="searchTerm"
        @change="handleInputChange" @keyDown="handleKeyDown" @focus="() => { searchTerm.trim(); showResults = true; }"
        class="w-full pl-10 pr-10 h-12 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" />

      <button v-if="searchTerm" @click="handleClearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600">
        <X class="h-5 w-5 text-gray-400" />
      </button>
    </div>
    <div v-if="showResults && (searchTerm.trim() || isLoading)"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div v-if="isLoading" class="p-4 text-center">
        <div class="inline-flex items-center gap-2 text-gray-500">
          <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          Buscando...
        </div>
      </div>
      <div v-else>
        <div v-if="getTotalResults === 0 && debouncedSearch" class="p-6 text-center">
          <Package class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500 font-medium">No se encontraron resultados</p>
          <p class="text-gray-400 text-sm mt-1">Intenta con otros términos de búsqueda</p>
        </div>

        <div v-if="searchResults.categories.length > 0" class="border-b border-gray-100">
          <div class="p-3">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Categorías</h3>
            <div class="space-y-1">
              <NuxtLink v-for="category in searchResults.categories" :key="category"
                :to="`/categoria/${category.toLowerCase()}`"
                class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                📁 {{ highlightText(category, debouncedSearch) }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-if="searchResults.products.length > 0" class="p-3">
          <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Productos ({{ searchResults.products.length }})
          </h3>
          <div class="space-y-2">
            <NuxtLink v-for="product in searchResults.products" :key="product.id" :to="`/producto/${product.slug}`"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div class="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img :src="product.image" :alt="product.name" fill class="object-contain p-1" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 line-clamp-2">
                  {{ product.name }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500">
                    {{ product.brand }}
                  </span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-500">
                    {{ product.category }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductSearch } from '@/types/product';
import { Clock, Package, Search, X } from 'lucide-vue-next';

const sanctumFetch = useSanctumClient();

const searchTerm = ref('');
const searchRef = ref(null);
const inputRef = ref(null);
const showResults = ref(false);
const isLoading = ref(false);
const searchResults = ref<{
  products: ProductSearch[],
  categories: string[],
  brands: string[],
}>({
  products: [],
  categories: [],
  brands: [],
});
const productsResults = ref<ProductSearch[]>([]);

const handleInputChange = () => {
  if (searchTerm.value.trim()) {
    showResults.value = true;
  } else {
    showResults.value = false;
  }
}
const handleKeyDown = () => {
  console.log('key down');
}
const handleClearSearch = () => {
  searchTerm.value = "";
  showResults.value = false;
  debouncedSearch.value = '';
  productsResults.value = [];
  inputRef.value.focus()
}

const debouncedSearch = ref('');
let timeout: ReturnType<typeof setTimeout>;

watch(searchTerm, (value) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedSearch.value = value;
    if (debouncedSearch.value) {
      performSearch(debouncedSearch.value);
    } else {
      searchResults.value = { products: [], categories: [], brands: [] };
      showResults.value = false;
    }
  }, 500)
})

const handleClickOutside = (event: MouseEvent) => {
  if (searchRef.value && !searchRef.value.contains(event.target as Node)) {
    showResults.value = false;
  }
}

const performSearch = async (term: string) => {
  isLoading.value = true;
  productsResults.value = [];

  const data = await sanctumFetch<ProductSearch[]>(`/search?search=${term}`);
  productsResults.value = data;

  const searchLower = term.toLowerCase()

  // Obtener categorías únicas
  const categories = [
    ...new Set(
      productsResults.value
        .filter((product: ProductSearch) => product.category.toLowerCase().includes(searchLower))
        .map((product: ProductSearch) => product.category),
    ),
  ]

  // Obtener marcas únicas
  const brands = [
    ...new Set(
      productsResults.value
        .filter((product: ProductSearch) => product.brand.toLowerCase().includes(searchLower))
        .map((product: ProductSearch) => product.brand),
    ),
  ]

  searchResults.value = {
    products: productsResults.value.slice(0, 6),
    categories: categories.slice(0, 3),
    brands: brands.slice(0, 3),
  };

  showResults.value = true;
  isLoading.value = false;
}

const getTotalResults = computed<number>(() => searchResults.value.products.length + searchResults.value.categories.length + searchResults.value.brands.length)

const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text

  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? `
      <mark key="${index}" class="bg-yellow-200 text-yellow-900 px-0.5 rounded" >
      ${part}
      </mark>
  ` :
      part
  )
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style></style>