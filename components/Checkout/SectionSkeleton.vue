<template>
  <Card>
    <CardContent class="px-6">
      <div class="flex items-start justify-between">
        <div class="flex justify-center gap-3">
          <Skeleton class="size-8 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-6 w-full rounded-xl" />
            <Skeleton class="h-4 w-[200px]" />
            <Skeleton class="h-4 w-[150px]" />
            <Skeleton class="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton class="h-8 w-[100px]" />
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';


</script>

<style></style>