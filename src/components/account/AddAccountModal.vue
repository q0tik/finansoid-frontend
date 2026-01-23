<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { getCurrenciesDropdown } from '@/api/currencies'
import { X, Landmark, Check, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ show: Boolean })
const emits = defineEmits(['close', 'created'])

const title = ref('')
const balance = ref('')
const currencyId = ref('')
const currencies = ref([])
const isDropdownOpen = ref(false)

function closeDropdown() {
  isDropdownOpen.value = false
}

const selectedCurrency = computed(() => 
  currencies.value.find((c) => c.id === currencyId.value)
)

async function handleSubmit() {
  if (!title.value.trim() || !currencyId.value) return
  
  emits('created', {
    profile_id: localStorage.getItem('active_profile'),
    title: title.value.trim(),
    currency_id: currencyId.value,
    saldo: balance.value || '0',
  })
  
  resetForm()
  emits('close')
}

function resetForm() {
  title.value = ''
  balance.value = ''
  isDropdownOpen.value = false
}

watch(() => props.show, async (open) => {
  if (open) {
    try {
      const res = await getCurrenciesDropdown(localStorage.getItem('active_profile'))
      currencies.value = res.currencies_short
      
      const rub = currencies.value.find(c => c.code === 'RUB')
      if (rub) currencyId.value = rub.id
      else if (currencies.value.length > 0) currencyId.value = currencies.value[0].id
      
      nextTick(() => document.getElementById('acc-title')?.focus())
    } catch (e) {
      console.error("Failed to load currencies", e)
    }
  }
})

function selectCurrency(id) {
  currencyId.value = id
  isDropdownOpen.value = false
}
</script>

<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4" 
      @click.self="emits('close')"
    >
      <div class="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200 relative">
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <Landmark class="w-5 h-5 text-primary" />
            <h2 class="text-xl font-bold tracking-tight">New Account</h2>
          </div>
          <button 
            @click="emits('close')" 
            class="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium ml-1">Title</label>
            <input 
              id="acc-title" 
              v-model="title" 
              type="text" 
              class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50" 
              placeholder="e.g. Cash, Bank..." 
              required 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium ml-1">Balance</label>
              <input 
                v-model="balance" 
                type="number" 
                step="0.01" 
                class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50" 
                placeholder="0.00" 
              />
            </div>

            <div class="space-y-2 relative">
              <label class="text-sm font-medium ml-1">Currency</label>
              
              <div 
                @click="isDropdownOpen = !isDropdownOpen"
                class="w-full h-[50px] flex items-center justify-between px-4 bg-background border border-input rounded-xl cursor-pointer hover:border-primary transition-all shadow-sm"
                :class="{ 'ring-2 ring-primary/20 border-primary': isDropdownOpen }"
              >
                <span v-if="selectedCurrency" class="text-sm font-bold tracking-wide uppercase">
                  {{ selectedCurrency.code }}
                </span>
                <ChevronDown 
                  class="w-4 h-4 text-muted-foreground transition-transform duration-200" 
                  :class="{ 'rotate-180': isDropdownOpen }" 
                />
              </div>

              <transition name="dropdown">
                <div 
                  v-if="isDropdownOpen" 
                  class="absolute top-[calc(100%+6px)] left-0 w-full bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div class="max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                    <div 
                      v-for="c in currencies" 
                      :key="c.id"
                      @click.stop="selectCurrency(c.id)"
                      class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                      :class="currencyId === c.id ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted'"
                    >
                      <div class="flex items-center gap-2">
                        <span>{{ c.code }}</span>
                        <span class="text-[10px] opacity-60">{{ c.symbol }}</span>
                      </div>
                      <Check v-if="currencyId === c.id" class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <Button 
            type="submit" 
            class="w-full h-12 text-base rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform mt-4"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.2);
  border-radius: 10px;
}
</style>