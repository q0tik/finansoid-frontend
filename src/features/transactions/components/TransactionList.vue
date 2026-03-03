<script setup>
import { Loader2 } from 'lucide-vue-next'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import TransactionGroup from './TransactionGroup.vue'

const props = defineProps({
  groups: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: true },
  isInitialLoad: { type: Boolean, default: true },
  loadMore: { type: Function, required: true },
  onSelect: { type: Function, required: true },
})

const { sentinel } = useInfiniteScroll(() => {
  if (props.hasMore && !props.loading) props.loadMore()
})
</script>

<template>
  <div>
    <TransactionGroup
      v-for="(items, date) in groups"
      :key="date"
      :date="date"
      :items="items"
      :on-select="onSelect"
    />

    <div ref="sentinel" class="py-6 flex flex-col items-center justify-center">
      <div v-if="loading && !isInitialLoad" class="flex flex-col items-center gap-2">
        <Loader2 class="w-6 h-6 animate-spin text-primary" />
        <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
          {{ $t('transaction.loading_more') }}
        </span>
      </div>
      <div v-else-if="loading && isInitialLoad" class="py-20">
        <Loader2 class="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
      <div
        v-else-if="!hasMore && Object.keys(groups).length > 0"
        class="flex flex-col items-center gap-2 opacity-20"
      >
        <div class="w-1 h-1 bg-foreground rounded-full"></div>
        <span class="text-[9px] font-black uppercase tracking-[0.3em]">{{ $t('transaction.all_loaded') }}</span>
      </div>
    </div>
  </div>
</template>
