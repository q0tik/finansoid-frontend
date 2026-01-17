<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  title: String,
  icon: Object,
  iconClass: String,
  isOpen: Boolean
})
defineEmits(['toggle'])
</script>

<template>
  <div class="bg-card border border-border rounded-[28px] overflow-hidden transition-all shadow-sm">
    <button
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-xl', iconClass]">
          <component :is="icon" class="w-5 h-5" />
        </div>
        <span class="font-bold tracking-tight">{{ title }}</span>
      </div>
      <ChevronDown 
        class="w-5 h-5 text-muted-foreground transition-transform duration-300" 
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    
    <transition name="expand">
      <div v-if="isOpen" class="px-4 pb-5 pt-2">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 800px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0; opacity: 0; transform: translateY(-10px);
}
</style>