<script setup>
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-vue-next'
import { getTransactionType, formatAmount, formatTime } from '@/lib/format'
import { useI18n } from 'vue-i18n'
import { useDefaultTitles } from '@/composables/useDefaultTitles'

const { t } = useI18n()
const { categoryTitle } = useDefaultTitles()

const props = defineProps({
  transaction: { type: Object, required: true },
  onSelect: { type: Function, required: true },
})

const type = computed(() => getTransactionType(props.transaction))
const amount = computed(() => formatAmount(props.transaction))
const time = computed(() => formatTime(props.transaction.created_at))
const label = computed(() => {
  if (type.value === 'transfer') return t('transaction.transfer')
  return categoryTitle(props.transaction.category) || t('common.other')
})
</script>

<template>
  <div class="group flex items-center justify-between p-4 active:bg-muted/50 transition-colors cursor-pointer" @click="onSelect(transaction.id)">
    <div class="flex items-center gap-4 min-w-0">
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          type === 'income'
            ? 'bg-emerald-500/10 text-emerald-500'
            : type === 'expense'
            ? 'bg-red-500/10 text-red-500'
            : 'bg-blue-500/10 text-blue-500',
        ]"
      >
        <ArrowDownLeft v-if="type === 'income'" class="w-5 h-5" />
        <ArrowUpRight v-else-if="type === 'expense'" class="w-5 h-5" />
        <ArrowLeftRight v-else class="w-4 h-4" />
      </div>
      <div class="flex flex-col min-w-0">
        <span class="font-bold text-[15px] leading-tight truncate text-foreground">{{ label }}</span>
        <span class="text-[11px] font-medium text-muted-foreground/60 mt-0.5 truncate">
          {{ time }}
          <span v-if="transaction.comment" class="opacity-50"> • {{ transaction.comment }}</span>
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3 shrink-0 text-right pr-3">
      <div
        :class="[
          'font-black text-base',
          type === 'income'
            ? 'text-emerald-500'
            : type === 'expense'
            ? 'text-red-500'
            : 'text-foreground',
        ]"
      >
        {{ amount }}
      </div>
    </div>
  </div>
</template>
