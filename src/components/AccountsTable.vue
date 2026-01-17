<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Trash2, Plus, Loader2, Wallet } from 'lucide-vue-next'
import { getAccounts, createAccount, deleteAccount } from '@/api/accounts'
import { Button } from '@/components/ui/button'
import AddAccountModal from '@/components/AddAccountModal.vue'
import DeleteAccountModal from '@/components/DeleteAccountModal.vue'

const accounts = ref([])
const loading = ref(false)
const isFetchingMore = ref(false)
const allLoaded = ref(false)
const page = ref(1)
const perPage = 6

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const deletingAccount = ref(null)

async function loadAccounts(append = false) {
  const profileId = localStorage.getItem('active_profile')
  if (!append) loading.value = true
  
  const response = await getAccounts(profileId, append ? page.value + 1 : 1, perPage)
  
  if (response.success) {
    if (append) {
      accounts.value = [...accounts.value, ...response.accounts]
      page.value++
    } else {
      accounts.value = response.accounts
      page.value = 1
    }
    
    if (response.accounts.length < perPage) allLoaded.value = true
  }
  loading.value = false
  isFetchingMore.value = false
}

async function handleScroll(event: Event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement
  if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetchingMore.value && !allLoaded.value) {
    isFetchingMore.value = true
    await loadAccounts(true)
  }
}

async function handleAdd(data) {
  await createAccount(data.profile_id, data.title, data.currency_id, data.saldo)
  allLoaded.value = false
  await loadAccounts(false)
}

function openDeleteModal(acc) {
  deletingAccount.value = acc
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!deletingAccount.value) return
  await deleteAccount(deletingAccount.value.id)
  allLoaded.value = false
  await loadAccounts(false)
  showDeleteModal.value = false
}

onMounted(() => loadAccounts())
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
          class="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <Wallet class="w-4 h-4" />
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-sm">{{ acc.title }}</span>
              <span class="text-xs text-muted-foreground">{{ acc.currency.code }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="font-mono font-bold text-sm">
                {{ Number(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              </span>
              <span class="text-xs ml-1 text-muted-foreground">{{ acc.currency.symbol }}</span>
            </div>
            
            <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-destructive" @click="openDeleteModal(acc)">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div v-if="isFetchingMore" class="flex justify-center py-2">
          <Loader2 class="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>

      <Button variant="outline" class="w-full h-12 border-dashed border-2 gap-2 text-muted-foreground hover:text-primary rounded-xl" @click="showAddModal = true">
        <Plus class="w-4 h-4" /> Add Account
      </Button>
    </div>

    <AddAccountModal :show="showAddModal" @close="showAddModal = false" @created="handleAdd" />
    <DeleteAccountModal :show="showDeleteModal" :title="deletingAccount?.title" @close="showDeleteModal = false" @confirm="confirmDelete" />
  </div>
</template>