<script setup>
import { ref, watch, nextTick } from 'vue'
import { X, Coins } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ show: Boolean })
const emits = defineEmits(['close', 'created'])

const title = ref('')
const code = ref('')
const symbol = ref('')
const decimals = ref(2)

function resetForm() {
  title.value = ''
  code.value = ''
  symbol.value = ''
  decimals.value = 2
}

function handleSubmit() {
  if (!title.value.trim() || !code.value.trim() || !symbol.value.trim()) {
    return // Можно добавить тост или алерт, если валидация не прошла
  }

  emits('created', {
    profile_id: localStorage.getItem('active_profile'),
    title: title.value.trim(),
    code: code.value.trim().toUpperCase(),
    symbol: symbol.value.trim(),
    decimal_digits: Number(decimals.value) || 2,
  })

  resetForm()
  emits('close')
}

watch(
  () => props.show,
  (val) => {
    if (val) nextTick(() => document.getElementById('currency-title')?.focus())
  }
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4"
      @click.self="emits('close')"
    >
      <div
        class="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200"
      >
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <Coins class="w-5 h-5 text-primary" />
            <h2 class="text-xl font-bold tracking-tight">Add currency</h2>
          </div>
          <button
            @click="emits('close')"
            class="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label for="currency-title" class="text-sm font-medium ml-1">Title</label>
            <input
              id="currency-title"
              v-model="title"
              type="text"
              class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground"
              placeholder="e.g. US Dollar"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="code" class="text-sm font-medium ml-1">Code</label>
              <input
                id="code"
                v-model="code"
                type="text"
                maxlength="4"
                class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all uppercase shadow-sm placeholder:text-muted-foreground"
                placeholder="USD"
                required
              />
            </div>
            <div class="space-y-2">
              <label for="symbol" class="text-sm font-medium ml-1">Symbol</label>
              <input
                id="symbol"
                v-model="symbol"
                type="text"
                class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground"
                placeholder="$"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="decimals" class="text-sm font-medium ml-1">Decimal digits</label>
            <input
              id="decimals"
              v-model="decimals"
              type="number"
              min="0"
              max="20"
              class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            class="w-full h-12 text-base rounded-xl font-bold mt-4 shadow-md transition-transform active:scale-[0.98]"
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>