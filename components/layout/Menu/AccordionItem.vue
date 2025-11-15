<template>
  <div>
    <button v-if="hasChildren" class="w-full flex justify-between items-center py-2 hover:bg-gray-100 font-semibold"
      :class="`pl-${basePadding}`" @click="toggle">
      <span>{{ item.name }}</span>
      <span class="text-lg">{{ isOpen ? '−' : '+' }}</span>
    </button>
    <a v-else :href="`/categoria/${item.slug}`" class="w-full flex justify-between items-center py-2 hover:bg-gray-100 font-semibold">
      {{ item.name }}
    </a>

    <transition name="slideUp">
      <ul v-if="isOpen">
        <li v-for="(child, i) in item.children" :key="i" class="cursor-pointer">
          <component :is="child.children ? AccordionItem : 'a'" :item="child" :level="level + 1" :href="child.slug"
            class="block w-full py-2" :class="`pl-${basePadding + 2}`">
            {{ child.name }}
          </component>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AccordionItem from './AccordionItem.vue'

const props = defineProps({
  item: Object,
  level: {
    type: Number,
    default: 0,
  },
})

const isOpen = ref(false)

const hasChildren = computed(() =>
  Array.isArray(props.item.children) && props.item.children.length > 0
)

const basePadding = computed(() => Math.min(2 + props.level * 2, 12))

const toggle = () => {
  if (hasChildren.value) isOpen.value = !isOpen.value
}
</script>

<style scoped>
.slideUp-enter-active,
.slideUp-leave-active {
  transition: all 0.2s ease;
}

.slideUp-enter-from,
.slideUp-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>