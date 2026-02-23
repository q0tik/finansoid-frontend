<script setup>
import { ref, watch, nextTick } from 'vue'
import { getProfileById, addUserToProfile, editProfileById } from '@/api/profiles'
import { 
  X, Info, Calendar, Wallet, Users as UsersIcon, Loader2, 
  User as UserIcon, Pencil, Plus, Check, RotateCcw,
  Link as LinkIcon
} from 'lucide-vue-next'
import InviteEntityModal from '@/components/InviteEntityModel.vue'
import Toast from '@/components/Toast.vue'
import { useProfileStore } from '@/stores/profileStore'

const store = useProfileStore()
const props = defineProps({
  show: Boolean,
  profileId: [String, Number]
})

const emit = defineEmits(['close'])

const profileData = ref(null)
const loading = ref(false)
const showAddUser = ref(false)

// Логика редактирования тайтла
const isEditing = ref(false)
const editedTitle = ref('')
const editLoading = ref(false)
const titleInput = ref(null)

async function fetchData() {
  if (!props.profileId) return
  loading.value = true
  const res = await getProfileById(props.profileId)
  if (res.success) {
    profileData.value = res.profile
    editedTitle.value = res.profile.title
  }
  loading.value = false
}

const startEdit = async () => {
  editedTitle.value = profileData.value.title
  isEditing.value = true
  await nextTick()
  titleInput.value?.focus()
}

const saveTitle = async () => {
  if (!editedTitle.value.trim() || editedTitle.value === profileData.value.title) {
    isEditing.value = false
    return
  }

  try {
    editLoading.value = true // Включили лоадер
    
    const res = await editProfileById(props.profileId, editedTitle.value)
    
    if (res?.success) {
      // Обновляем локально
      profileData.value.title = editedTitle.value
      
      // Обновляем в сторе
      const profileInStore = store.profiles.find(p => p.id === props.profileId)
      if (profileInStore) {
        profileInStore.title = editedTitle.value
      }

      showToast('Title updated!')
      isEditing.value = false
    } else {
      showToast('Failed to update title', 'error')
    }
  } catch (err) {
    console.error("Critical error in saveTitle:", err)
    showToast('System error', 'error')
  } finally {
    // ЭТО ВАЖНО: лоадер выключится всегда, даже если код выше упал
    editLoading.value = false 
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) fetchData()
  else {
    profileData.value = null
    isEditing.value = false // Сбрасываем режим редактирования при закрытии
  }
})

// Состояние тоста
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
}

const addUser = async (newUserId, callback) => {
    if (!props.profileId) return
    const res = await addUserToProfile(props.profileId, newUserId)
    if (res.success) {
        callback()
        showAddUser.value = false
        showToast('User added successfully!')
        await fetchData()
    } else {
        callback()
        showToast('Failed to add user. Check ID.', 'error')
    }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
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
                <div class="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Info class="w-5 h-5" />
                </div>
                <h3 class="font-black italic tracking-tight text-lg">Profile Details</h3>
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

              <div v-else-if="profileData" class="space-y-6">
                
                <div class="p-4 bg-muted/30 rounded-[24px] border border-border/50 transition-all">
                  <div v-if="!isEditing" class="flex items-center justify-between">
                    <div class="flex flex-col min-w-0">
                      <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Profile Title</span>
                      <h4 class="text-xl font-black italic truncate text-foreground">{{ profileData.title }}</h4>
                    </div>
                    <button 
                      @click="startEdit"
                      class="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-90"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                  </div>

                  <div v-else class="flex items-center gap-2">
                    <div class="flex-1 flex flex-col min-w-0">
                      <span class="text-[9px] font-black uppercase tracking-widest text-primary mb-1 ml-1">Editing Title...</span>
                      <input 
                        ref="titleInput"
                        v-model="editedTitle"
                        @keyup.enter="saveTitle"
                        @keyup.esc="isEditing = false"
                        class="bg-card border border-primary/30 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                    <div class="flex gap-1 shrink-0 mt-4">
                      <button 
                        @click="isEditing = false"
                        class="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                      >
                        <RotateCcw class="w-4 h-4" />
                      </button>
                      <button 
                        @click="saveTitle"
                        :disabled="editLoading"
                        class="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        <Loader2 v-if="editLoading" class="w-4 h-4 animate-spin" />
                        <Check v-else class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 bg-muted/20 rounded-2xl border border-border/40">
                    <Calendar class="w-4 h-4 text-muted-foreground mb-1" />
                    <span class="text-[9px] font-black uppercase tracking-wider text-muted-foreground block opacity-60">Created</span>
                    <span class="text-xs font-bold">{{ formatDate(profileData.created_at) }}</span>
                  </div>
                  <div class="p-3 bg-muted/20 rounded-2xl border border-border/40">
                    <Wallet class="w-4 h-4 text-muted-foreground mb-1" />
                    <span class="text-[9px] font-black uppercase tracking-wider text-muted-foreground block opacity-60">Accounts</span>
                    <span class="text-xs font-bold">{{ profileData.accounts_count }}</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between border-b border-border pb-2">
                    <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <UsersIcon class="w-3 h-3" />
                      <span>Members</span>
                    </div>
                    <button 
                      @click="showAddUser = true"
                      class="flex items-center gap-1 text-[9px] font-black uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Plus class="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                    <div v-for="user in profileData.users" :key="user.id" class="flex items-center gap-3 p-2.5 bg-muted/30 rounded-xl border border-border/50">
                      <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                        <UserIcon class="w-4 h-4" />
                      </div>
                      <span class="text-xs font-bold">{{ user.username }}</span>
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
      :show="showAddUser"
      title="Link User"
      label="User ID"
      placeholder="Enter user UUID..."
      button-text="Link to Profile"
      :icon="LinkIcon"
      @close="showAddUser = false"
      @submit="addUser"
    />
    <Toast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />
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