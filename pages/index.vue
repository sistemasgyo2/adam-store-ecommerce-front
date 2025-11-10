<template>
  <Carousel class="relative w-full" :opts="{
    align: 'start',
    loop: true,
  }" :plugins="[Autoplay({
      delay: 4000,
    })]">
    <CarouselContent>
      <CarouselItem v-for="slideImage in slides" class="col-span-1 overflow h-[80vh]" :key="slideImage.name">
        <div class="w-full h-full bg-gray-300 ">
          <NuxtImg :src="slideImage.image" :srcset="slideImage.responsive_image" :alt="slideImage.name" preload class="w-full h-full" />
        </div>
      </CarouselItem>
    </CarouselContent>
  </Carousel>

  <section v-if="categories.length > 3" class="w-full py-12 px-4 max-w-7xl mx-auto">
    <LayoutAppContainer class="mb-10">
      <div class="flex items-center justify-between mb-8">
        <AppTitle>Categorías</AppTitle>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[180px]">
        <NuxtLink :to="`/categoria/${categories[0].slug}`"
          class="group relative overflow-hidden rounded-2xl bg-gray-100 transition-transform hover:scale-[1.02] md:col-span-2 md:row-span-2">
          <img :src="categories[0].image" :alt="categories[0].name" fill
            class="object-cover transition-transform group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div class="absolute bottom-6 left-6 text-white">
            <h3 class="text-2xl font-semibold mb-2">{{ categories[0].name }}</h3>
            <p class="text-base opacity-90">Ver categoría</p>
          </div>
        </NuxtLink>

        <NuxtLink to="#"
          class="group relative overflow-hidden rounded-2xl bg-gray-100 transition-transform hover:scale-[1.02] md:col-span-1 md:row-span-1">
          <img :src="categories[1].image" :alt="categories[1].name" fill
            class="object-cover transition-transform group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-lg font-semibold mb-1">{{ categories[1].name }}</h3>
            <p class="text-sm opacity-90">Ver categoría</p>
          </div>
        </NuxtLink>

        <NuxtLink to="#"
          class="group relative overflow-hidden rounded-2xl bg-gray-100 transition-transform hover:scale-[1.02] md:col-span-1 md:row-span-1">
          <img :src="categories[2].image" :alt="categories[2].name" fill
            class="object-cover transition-transform group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-lg font-semibold mb-1">{{ categories[2].name }}</h3>
            <p class="text-sm opacity-90">Ver categoría</p>
          </div>
        </NuxtLink>

        <NuxtLink v-for="category in categories.slice(3)" :to="`/categoria/${category.slug}`" :key="category.slug"
          class="group relative overflow-hidden rounded-2xl bg-gray-100 transition-transform hover:scale-[1.02] md:col-span-1 md:row-span-1">
          <img :src="category.image" :alt="category.name" fill
            class="object-cover transition-transform group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-lg font-semibold mb-1">{{ category.name }}</h3>
            <p class="text-sm opacity-90">Ver categoría</p>
          </div>
        </NuxtLink>
      </div>
    </LayoutAppContainer>
  </section>
  <section class="py-12 bg-gray-50">
    <LayoutAppContainer>
      <div class="relative overflow-hidden">
        <div class="flex animate-scroll w-max whitespace-nowrap">
          <template v-for="n in 2">
            <div v-for="brand in brands" :key="brand.name" class="flex-shrink-0 mx-8 flex items-center justify-center">
              <NuxtImg :src="brand.image" width="120" height="60" :alt="brand.name" loading="lazy"
                class="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
            </div>
          </template>
        </div>
      </div>
    </LayoutAppContainer>
  </section>
  <section class="py-8 md:py-12">
    <LayoutAppContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        <div v-for="subSlide in mainSlides" :key="subSlide.name"
          class="group block rounded-xl overflow-hidden transition-all duration-300 transform">
          <div class="w-full aspect-[4/3]"> <!-- puedes ajustar la relación de aspecto -->
            <NuxtImg :src="subSlide.image" :srcset="subSlide.responsive_image" :alt="subSlide.name" loading="lazy"
              class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </LayoutAppContainer>
  </section>
  <section>
    <LayoutAppContainer class="mb-10">
      <AppTitle>Super Ofertas</AppTitle>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-if="lastSlide" class="lg:col-span-1 rounded-lg overflow-hidden">
          <NuxtImg :src="lastSlide.image" :srcset="lastSlide.responsive_image" :alt="lastSlide.name"
            class="w-full h-full object-cover" loading="lazy" />
        </div>

        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AppProductItem v-for="n in 3" :product="productExample" :key="n" />
          </div>
        </div>
      </div>
    </LayoutAppContainer>
  </section>

  <section>
    <LayoutAppContainer class="mb-10">
      <AppTitle>Lo más destacado</AppTitle>
      <Carousel :opts="{
        align: 'start',
        loop: true,
      }">
        <CarouselContent>
          <CarouselItem v-for="n in 8" class="basis-full sm:basis-1/2 md:bases-1/3 lg:basis-1/5">
            <AppProductItem :product="productExample" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </LayoutAppContainer>
  </section>

</template>

<script lang="ts" setup>
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import type { Brand, Category, HomePage, Slide } from '@/types/pages';
import type { ProductItem } from '@/types/product';
import Autoplay from 'embla-carousel-autoplay';

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
      decimal: 20.00,
      formatted: 'S/ 20.00'
    },
    alt_price: {
      decimal: 20.00,
      formatted: 'S/ 20.00'
    }
  },
  image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
  is_new: false,
  has_discount: false,
}

const { data } = await useSanctumFetch<HomePage>('/api/home');

const slides: Ref<Slide[]> = ref<Slide[]>(data.value.slides);
const subSlides: Ref<Slide[]> = ref<Slide[]>(data.value.subSlides);
const brands: Ref<Brand[]> = ref<Brand[]>(data.value.brands);
const categories: Ref<Category[]> = ref<Category[]>(data.value.categories);

const mainSlides = ref<Slide[]>(subSlides.value.slice(0, 4));
const lastSlide = ref<Slide | null>(subSlides.value[4] ?? null);


useHead({
  title: 'Adams Store',
});
</script>

<style></style>