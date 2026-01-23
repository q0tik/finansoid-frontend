<script setup>
import { ref, watch, nextTick } from 'vue'
import { getAccountById, editAccountById, addProfileToAccount } from '@/api/accounts'
import { 
  X, Info, Wallet, Loader2, Hash, ShieldCheck, 
  Users as UsersIcon, Pencil, Check, RotateCcw, Plus,
  Link as LinkIcon 
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import InviteEntityModal from '@/components/InviteEntityModel.vue'

const props = defineProps({
  show: Boolean,
  accountId: [String, Number]
})

const emit = defineEmits(['close', 'updated'])

const accountData = ref(null)
const loading = ref(false)
const showAddProfile = ref(false)

// Логика редактирования тайтла
const isEditing = ref(false)
const editedTitle = ref('')
const editLoading = ref(false)
const titleInput = ref(null)

async function fetchData() {
  if (!props.accountId) return
  loading.value = true
  const profileId = localStorage.getItem('active_profile')
  const res = await getAccountById(props.accountId, profileId)
  if (res.success) {
    accountData.value = res.account
    editedTitle.value = res.account.title
  }
  loading.value = false
}

const startEdit = async () => {
  if (!accountData.value?.is_owner) return
  editedTitle.value = accountData.value.title
  isEditing.value = true
  await nextTick()
  titleInput.value?.focus()
}

const saveTitle = async () => {
  if (!editedTitle.value.trim() || editedTitle.value === accountData.value.title) {
    isEditing.value = false
    return
  }

  try {
    editLoading.value = true
    const profileId = localStorage.getItem('active_profile')
    const res = await editAccountById(props.accountId, profileId, editedTitle.value)
    
    if (res?.success) {
      accountData.value.title = editedTitle.value
      showToast('Account renamed!')
      isEditing.value = false
      emit('updated')
    } else {
      showToast('Failed to rename', 'error')
    }
  } catch (err) {
    showToast('System error', 'error')
  } finally {
    editLoading.value = false 
  }
}

// Логика привязки нового профиля
const handleAddProfile = async (targetProfileId, callback) => {
  if (!props.accountId) return
  
  // Достаем текущий активный профиль для авторизации действия на бэкенде
  const activeProfileId = localStorage.getItem('active_profile')
  
  // Вызываем твой метод: (id аккаунта, текущий профиль, приглашаемый профиль)
  const res = await addProfileToAccount(
    props.accountId, 
    activeProfileId, 
    targetProfileId
  )
  
  if (res.success) {
    showToast('Profile linked successfully!')
    showAddProfile.value = false
    callback() // Очистка лоадера и инпута в InviteEntityModal
    await fetchData() // Обновляем список профилей в этой модалке
    emit('updated') 
  } else {
    // Если бэкенд вернет ошибку (например, профиль уже добавлен или ID неверный)
    showToast('Failed to link profile. Check ID.', 'error')
    callback()
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) fetchData()
  else {
    accountData.value = null
    isEditing.value = false
    showAddProfile.value = false
  }
})

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
}
</script>

<template>
  <div>
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
        <Transition name="slide-up">
          <div v-if="show" class="w-full max-w-[400px] bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl">
            
            <div class="p-3 pl-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Wallet class="w-5 h-5" />
                </div>
                <h3 class="font-black italic tracking-tight text-lg text-foreground">Account Details</h3>
              </div>
              <button @click="emit('close')" class="p-2 pr-5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="p-6">
              <div v-if="loading" class="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 class="w-8 h-8 animate-spin text-primary" />
                <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching Data...</span>
              </div>

              <div v-else-if="accountData" class="space-y-6">
                
                <div class="p-4 bg-muted/30 rounded-[24px] border border-border/50 transition-all">
                  <div v-if="!isEditing" class="flex items-center justify-between">
                    <div class="flex flex-col min-w-0">
                      <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Account Name</span>
                      <h4 class="text-lg font-black italic truncate text-foreground">{{ accountData.title }}</h4>
                    </div>
                    <button 
                      v-if="accountData.is_owner"
                      @click="startEdit"
                      class="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-emerald-500 transition-all active:scale-90 shadow-sm"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                  </div>

                  <div v-else class="flex items-center gap-2">
                    <div class="flex-1 flex flex-col min-w-0">
                      <span class="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1 ml-1">Editing Title...</span>
                      <input 
                        ref="titleInput"
                        v-model="editedTitle"
                        @keyup.enter="saveTitle"
                        @keyup.esc="isEditing = false"
                        class="bg-card border border-emerald-500/30 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500 w-full"
                      />
                    </div>
                    <div class="flex gap-1 shrink-0 mt-4">
                      <button @click="isEditing = false" class="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                        <RotateCcw class="w-4 h-4" />
                      </button>
                      <button 
                        @click="saveTitle"
                        :disabled="editLoading"
                        class="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        <Loader2 v-if="editLoading" class="w-4 h-4 animate-spin" />
                        <Check v-else class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                  <div class="col-span-3 p-3 bg-muted/20 rounded-2xl border border-border/40 flex flex-col items-center justify-center">
                    <Hash class="w-3.5 h-3.5 text-muted-foreground/50 mb-1" />
                    <span class="text-[11px] font-black italic">{{ accountData.transactions_count }}</span>
                    <span class="text-[7px] font-black uppercase opacity-40 leading-none mt-1">TXS</span>
                  </div>

                  <div class="col-span-6 p-3 bg-muted/40 rounded-2xl border border-border/60 flex flex-col items-center justify-center">
                    <div class="flex items-baseline gap-1">
                      <span class="text-xl font-black italic tracking-tighter leading-none">
                        {{ Number(accountData.balance).toLocaleString() }}
                      </span>
                      <span class="text-[10px] font-black text-muted-foreground/60 italic uppercase">
                        {{ accountData.currency.symbol }}
                      </span>
                    </div>
                    <span class="text-[7px] font-black uppercase opacity-40 leading-none mt-1">Balance</span>
                  </div>

                  <div class="col-span-3 p-3 bg-muted/20 rounded-2xl border border-border/40 flex flex-col items-center justify-center">
                    <div 
                      class="w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-colors"
                      :class="accountData.is_owner ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground/40'"
                    >
                      <ShieldCheck v-if="accountData.is_owner" class="w-3.5 h-3.5" />
                      <UsersIcon v-else class="w-3.5 h-3.5" />
                    </div>
                    <span class="text-[7px] font-black uppercase opacity-40 leading-none">
                      {{ accountData.is_owner ? 'Owner' : 'Guest' }}
                    </span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between border-b border-border pb-2">
                    <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <UsersIcon class="w-3.5 h-3.5" />
                      <span>Linked Profiles</span>
                    </div>
                    <button 
                      v-if="accountData.is_owner"
                      @click="showAddProfile = true"
                      class="flex items-center gap-1 text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors shadow-sm"
                    >
                      <Plus class="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                    <div v-for="profile in accountData.profiles" :key="profile.id" class="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border/50">
                      <span class="text-xs font-bold italic truncate mr-2">{{ profile.title }}</span>
                      <div v-if="profile.is_owner" class="shrink-0 text-[7px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                        Owner
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <InviteEntityModal 
      :show="showAddProfile"
      title="Link Profile"
      label="Profile UUID"
      placeholder="00000000-0000-..."
      button-text="Link Profile"
      :icon="LinkIcon"
      @close="showAddProfile = false"
      @submit="handleAddProfile"
    />

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
</style>