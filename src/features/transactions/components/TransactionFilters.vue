<script setup>
import { computed, ref } from 'vue'
import { Wallet, ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  accountId: { default: null },
  fromDttm: { type: String, default: '' },
  toDttm: { type: String, default: '' },
  accounts: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:accountId', 'update:fromDttm', 'update:toDttm'])

const activeDropdown = ref(null)
const selectedAccount = computed(() => props.accounts.find((a) => a.id === props.accountId))

function selectAccount(id) {
  emit('update:accountId', id)
  activeDropdown.value = null
}
</script>

<template>
  <div class="space-y-3">
    <!-- Account selector -->
    <div class="relative">
      <div
        @click="activeDropdown = activeDropdown === 'account' ? null : 'account'"
        class="w-full flex items-center justify-between p-3 bg-card border border-border rounded-2xl cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99]"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 text-primary rounded-xl">
            <Wallet class="w-4 h-4" />
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-black uppercase tracking-wider leading-none">
              {{ selectedAccount ? selectedAccount.title : $t('transaction.all_accounts') }}
            </span>
            <span
              v-if="selectedAccount"
              class="text-[9px] text-muted-foreground mt-1 font-bold uppercase opacity-60"
            >
              {{ selectedAccount.currency_code }}
            </span>
          </div>
        </div>
        <ChevronDown
          class="w-4 h-4 text-muted-foreground transition-transform"
          :class="{ 'rotate-180': activeDropdown === 'account' }"
        />
      </div>

      <transition name="dropdown">
        <div
          v-if="activeDropdown === 'account'"
          class="absolute z-50 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
        >
          <div class="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
            <div
              @click="selectAccount(null)"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
              :class="{ 'bg-primary/5': accountId === null }"
            >
              <span
                class="text-[11px] font-bold uppercase tracking-wider"
                :class="{ 'text-primary': accountId === null }"
              >
                {{ $t('transaction.all_accounts') }}
              </span>
              <Check v-if="accountId === null" class="w-4 h-4 text-primary" />
            </div>

            <div
              v-for="a in accounts"
              :key="a.id"
              @click="selectAccount(a.id)"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1 last:mb-0"
              :class="{ 'bg-primary/5': accountId === a.id }"
            >
              <div class="flex flex-col">
                <span
                  class="text-[11px] font-bold uppercase tracking-wider"
                  :class="{ 'text-primary': accountId === a.id }"
                >
                  {{ a.title }}
                </span>
                <span class="text-[9px] text-muted-foreground font-bold uppercase opacity-60">
                  {{ a.currency_code }}
                </span>
              </div>
              <Check v-if="accountId === a.id" class="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Date range -->
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <label class="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 ml-2">
          {{ $t('transaction.from_date') }}
        </label>
        <input
          type="datetime-local"
          :value="fromDttm"
          @input="emit('update:fromDttm', $event.target.value)"
          class="bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 ml-2">
          {{ $t('transaction.to_date') }}
        </label>
        <input
          type="datetime-local"
          :value="toDttm"
          @input="emit('update:toDttm', $event.target.value)"
          class="bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
input[type='datetime-local']::-webkit-calendar-picker-indicator {
  filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
  opacity: 0.5;
}
</style>
