<template>
  <LayoutAppContainer class="py-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Filters -->
      <div class="lg:col-span-1 space-y-3 divide-y-1">
        <div v-for="option in options" :key="option.id" class="p-4">
          <h3 class="font-semibold text-gray-900 mb-4">{{ option.name }}</h3>
          <div class="space-y-3">
            <div v-for="value in option.values" :key="value.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox :modelValue="(filters.options[option.id] || []).includes(value.id)"
                  v-on:update:model-value="(checked: boolean | 'indeterminate') => toggleSelectedOption(option.id, value.id, checked)" />
                <label class="text-sm text-gray-700 cursor-pointer select-none">
                  {{ value.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-for="attribute in attributes" :key="attribute.id" class="p-4">
          <h3 class="font-semibold text-gray-900 mb-4">{{ attribute.name }}</h3>
          <div class="space-y-3">
            <div v-for="value in attribute.values" :key="value.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox :id="value.id.toString()"
                  :modelValue="(filters.attributes[attribute.id] || []).includes(value.id)"
                  v-on:update:model-value="(checked: boolean | 'indeterminate') => toggleSelectedAttribute(attribute.id, value.id, checked)" />
                <label class="text-sm text-gray-700 cursor-pointer select-none">
                  {{ value.value }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button class="w-full" @click="applyFilter">Filtrar</Button>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-3">
        <!-- Header -->
        <div
          class="bg-white mb-6 flex flex-col md:flex-row items-start md:justify-between md:items-center justify-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ pageTitle }}</h1>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <!-- <Select :model-value="filters.sortBy" @update:model-value="handleSortByChange">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Orden predeterminado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Orden predeterminado</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select> -->

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
        <div v-if="!isLoading" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AppProductItem v-for="product in products" :key="product.id" :product="product" />
        </div>
        <div v-else class="flex justify-center items-center">
          <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  </LayoutAppContainer>
</template>

<script lang="ts" setup>
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid2X2, List } from 'lucide-vue-next';
import type { Attribute, BrandElement, PageResponse, ProductOption } from '@/types/pages';
import type { ProductItem } from '@/types/product';

const viewMode: Ref<"grid" | "list"> = ref<"grid" | "list">('grid');
const selectedBrand: Ref<number[]> = ref<number[]>([]);

const sanctumFetch = useSanctumClient();

const route = useRoute();
const categorySlug = route.params.category as string;

if (!route.params.category?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Missing Product Handle',
  })
}

const attributes: Ref<Attribute[]> = ref<Attribute[]>([]);
const options: Ref<ProductOption[]> = ref<ProductOption[]>([]);

const products = ref<ProductItem[]>([]);
const isLoading = ref(false);
const error = ref<Error | null>(null);
const pageTitle: Ref<string> = ref<string>('Categoría de Productos');

const filters = reactive<{
  sortBy: string;
  brands: number[];
  attributes: Record<number, number[]>;
  options: Record<number, number[]>;
}>({
  sortBy: 'default',
  brands: [],
  attributes: {},
  options: {},
});

const data = await sanctumFetch<PageResponse>(`/api/category/${categorySlug}`);

if (data) {
  pageTitle.value = data.title;
  products.value = data.data;
  attributes.value = data.filters.attributes;
  options.value = data.filters.options;

  data.filters.attributes.forEach((attribute: any) => {
    filters.attributes[attribute.id] = [];
  });

  data.filters.options.forEach((option: any) => {
    filters.options[option.id] = [];
  });

  useHead({
    title: data.title,
  })
}

const computedFilterParams = computed(() => {
  const params = new URLSearchParams();

  if (filters.sortBy !== 'default') {
    params.append('sortBy', filters.sortBy);
  }

  for (const [attributeId, values] of Object.entries(filters.attributes)) {
    if ((values as number[]).length > 0) {
      (values as number[]).forEach(valueId => {
        params.append(`attributes[${attributeId}][]`, String(valueId));
      });
    }
  }

  for (const [optionId, values] of Object.entries(filters.options)) {
    if ((values as number[]).length > 0) {
      (values as number[]).forEach(valueId => {
        params.append(`options[${optionId}][]`, String(valueId));
      });
    }
  }

  return params;
});

const fetchProducts = async () => {
  isLoading.value = true;

  try {
    const res = await useSanctumFetch<PageResponse>(
      `/api/category/${categorySlug}?${computedFilterParams.value.toString()}`
    );

    if (res.data.value) {
      products.value = res.data.value.data;
    }
  } catch (e: any) {
    error.value = e;
  } finally {
    isLoading.value = false;
  }
};

const toggleSelectedAttribute = (attributeId: number, optionValueId: number, checked: boolean | 'indeterminate') => {
  let currentValues = [...filters.attributes[attributeId]];
  const isChecked = checked === true;

  if (isChecked) {
    if (!currentValues.includes(optionValueId)) {
      currentValues.push(optionValueId);
    }
  } else {
    currentValues = currentValues.filter(val => val !== optionValueId);
  }
  filters.attributes[attributeId] = currentValues;
};

const toggleSelectedOption = (optionId: number, optionValueId: number, checked: boolean | 'indeterminate') => {
  let currentValues = [...filters.options[optionId]];
  const isChecked = checked === true;

  if (isChecked) {
    if (!currentValues.includes(optionValueId)) {
      currentValues.push(optionValueId);
    }
  } else {
    currentValues = currentValues.filter(val => val !== optionValueId);
  }
  filters.options[optionId] = currentValues;
};


const handleSortByChange = (value: string) => {
  filters.sortBy = value;

  fetchProducts();
};

const applyFilter = () => {
  fetchProducts();
};
</script>

<style></style>