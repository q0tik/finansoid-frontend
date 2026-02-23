<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Plus, Loader2, Wallet, Users, Info as InfoIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAccounts } from '@/features/accounts/composables/useAccounts'
import AddAccountModal from './AddAccountModal.vue'
import AccountInfoModal from './AccountInfoModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'

const { accounts, loading, isFetchingMore, handleScroll, create, remove } = useAccounts()

// Modal state (UI concern, stays in component)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const deletingAccount = ref(null)
const showInfoModal = ref(false)
const selectedAccountId = ref(null)

function openInfo(acc) {
  selectedAccountId.value = acc.id
  showInfoModal.value = true
}

function openDeleteModal(acc) {
  deletingAccount.value = acc
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!deletingAccount.value) return
  await remove(deletingAccount.value.id)
  showDeleteModal.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading && accounts.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-16 w-full bg-muted animate-pulse rounded-xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div @scroll="handleScroll" class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        <div
          v-for="acc in accounts"
          :key="acc.id"
          class="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 transition-all"
          :class="[
            acc.is_owner
              ? 'hover:bg-card/60'
              : 'opacity-60 grayscale-[0.2] bg-muted/20 border-dashed',
          ]"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="p-2 rounded-lg shrink-0"
              :class="acc.is_owner ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'"
            >
              <Wallet class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-sm truncate">{{ acc.title }}</span>
                <Users v-if="!acc.is_owner" class="w-3 h-3 text-muted-foreground shrink-0" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {{ acc.currency.code }}
                <template v-if="!acc.is_owner"> • {{ $t('common.shared') }}</template>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right whitespace-nowrap">
              <span class="font-mono font-bold text-sm">
                {{ Number(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              </span>
              <span class="text-xs ml-1 text-muted-foreground">{{ acc.currency.symbol }}</span>
            </div>

            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 text-muted-foreground hover:text-blue-500 transition-colors"
                @click="openInfo(acc)"
              >
                <InfoIcon class="w-4 h-4" />
              </Button>

              <div class="w-8 h-8 flex items-center justify-center">
                <Button
                  v-if="acc.is_owner"
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  @click="openDeleteModal(acc)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
                <div v-else class="flex items-center justify-center text-muted-foreground/30">
                  <Users class="w-3.5 h-3.5" :title="$t('common.shared')" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isFetchingMore" class="flex justify-center py-2">
          <Loader2 class="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>

      <Button
        variant="outline"
        class="w-full h-12 border-dashed border-2 gap-2 text-muted-foreground hover:text-primary rounded-xl"
        @click="showAddModal = true"
      >
        <Plus class="w-4 h-4" /> {{ $t('account.add') }}
      </Button>
    </div>

    <AddAccountModal :show="showAddModal" @close="showAddModal = false" @created="create" />
    <DeleteModal
      :show="showDeleteModal"
      :entity-title="deletingAccount?.title || ''"
      :description="$t('account.delete_desc')"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
    <AccountInfoModal
      :show="showInfoModal"
      :account-id="selectedAccountId"
      @close="showInfoModal = false"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
