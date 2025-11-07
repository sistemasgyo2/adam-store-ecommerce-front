<template>
  <div class="w-full py-6">
    <LayoutAppContainer>
      <div class="flex flex-col space-y-2">
        <h1 class="text-3xl font-bold">{{ title }}</h1>
        <p>Última actualización: {{ lastUpdated }}</p>
      </div>
    </LayoutAppContainer>
  </div>
  <div class="w-full py-6">
    <LayoutAppContainer>
      <div v-html="content" class="prose prose-gray max-w-none dark:prose-invert">

      </div>
    </LayoutAppContainer>
  </div>
</template>

<script lang="ts" setup>
import type { Page } from '@/types/pages';

const route = useRoute()

const sanctumFetch = useSanctumClient();

const data = await sanctumFetch<Page>(`/api/pages/${route.params.slug}`);

const title = ref(data.title);
const content = ref(data.content);
const lastUpdated = ref(data.last_updated);

useHead({
  title: title,
});

</script>

<style></style>