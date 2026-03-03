<script setup>
import { ref, watch } from 'vue'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, X, Trash2, Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { getTransactionById, deleteTransaction } from '@/api/transactions'
import { getTransactionType, formatTime, formatDate } from '@/lib/format'
import { useDefaultTitles } from '@/composables/useDefaultTitles'
import ConfirmModal from '@/components/ConfirmModal.vue'

const props = defineProps({
  show: Boolean,
  transactionId: [String, Number],
})

const emit = defineEmits(['close', 'deleted'])

const { t } = useI18n()
const { categoryTitle } = useDefaultTitles()

const txData = ref(null)
const loading = ref(false)
const showConfirm = ref(false)
const deleteLoading = ref(false)

const type = ref('expense')
const label = ref('')

async function fetchData() {
  if (!props.transactionId) return
  loading.value = true
  const res = await getTransactionById(props.transactionId)
  if (res.success) {
    txData.value = res
    type.value = getTransactionType({ category: res.category })
    label.value =
      type.value === 'transfer'
        ? t('transaction.transfer')
        : categoryTitle(res.category) || t('common.other')
  }
  loading.value = false
}

async function confirmDelete() {
  deleteLoading.value = true
  const res = await deleteTransaction(props.transactionId)
  deleteLoading.value = false
  if (res.success) {
    showConfirm.value = false
    emit('deleted')
  }
}

watch(
  () => props.show,
  (open) => {
    if (open) fetchData()
    else {
      txData.value = null
      showConfirm.value = false
    }
  },
)
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <Transition name="zoom-in">
          <div
            v-if="show"
            class="w-full max-w-[400px] bg-card border border-border rounded-[32px] shadow-2xl flex flex-col max-h-[85vh]"
          >
            <!-- Header -->
            <div class="flex items-center gap-4 px-6 pt-6 pb-4">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                  type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : type === 'expense'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500',
                ]"
              >
                <ArrowDownLeft v-if="type === 'income'" class="w-6 h-6" />
                <ArrowUpRight v-else-if="type === 'expense'" class="w-6 h-6" />
                <ArrowLeftRight v-else class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-bold text-lg leading-tight truncate">
                  {{ loading ? '...' : label }}
                </h2>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ $t('transaction.details') }}
                </p>
              </div>
              <button
                class="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                @click="emit('close')"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 pb-2 flex-1 overflow-y-auto">
              <div v-if="loading" class="flex justify-center py-10">
                <Loader2 class="w-7 h-7 animate-spin text-primary opacity-30" />
              </div>

              <template v-else-if="txData">
                <!-- Date / time -->
                <div class="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{{ formatDate(txData.created_at) }}</span>
                  <span>{{ formatTime(txData.created_at) }}</span>
                </div>

                <!-- Comment -->
                <div
                  v-if="txData.comment"
                  class="bg-muted/50 rounded-2xl px-4 py-3 text-sm text-muted-foreground mb-4 italic"
                >
                  "{{ txData.comment }}"
                </div>

                <!-- Entries -->
                <div class="mb-2">
                  <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">
                    {{ $t('transaction.entries') }}
                  </p>
                  <div class="space-y-2">
                    <div
                      v-for="(entry, i) in txData.entries"
                      :key="i"
                      class="flex items-center justify-between bg-muted/30 rounded-2xl px-4 py-3"
                    >
                      <div class="min-w-0">
                        <p class="font-semibold text-sm truncate">{{ entry.account.title }}</p>
                        <p class="text-[11px] text-muted-foreground/60 mt-0.5 uppercase tracking-wide">
                          {{ $t(`transaction.entry_${entry.type}`, entry.type) }}
                        </p>
                      </div>
                      <span
                        :class="[
                          'font-black text-sm shrink-0 ml-3',
                          entry.type === 'to'
                            ? 'text-emerald-500'
                            : entry.type === 'from'
                              ? 'text-red-500'
                              : 'text-muted-foreground',
                        ]"
                      >
                        {{ entry.amount }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="px-6 pt-3 pb-6">
              <button
                class="w-full h-12 rounded-2xl bg-destructive/10 text-destructive font-bold text-sm flex items-center justify-center gap-2 hover:bg-destructive/20 active:bg-destructive/30 transition-colors disabled:opacity-50"
                :disabled="loading || deleteLoading"
                @click="showConfirm = true"
              >
                <Trash2 class="w-4 h-4" />
                {{ $t('transaction.delete_title') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <ConfirmModal
      :show="showConfirm"
      :title="$t('transaction.delete_title')"
      :description="$t('transaction.delete_desc')"
      :confirm-text="$t('common.delete')"
      danger
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-in-enter-active,
.zoom-in-leave-active {
  transition: all 0.2s ease;
}
.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
