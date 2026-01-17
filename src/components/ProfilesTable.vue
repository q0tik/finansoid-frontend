<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Trash2, Plus, CheckCircle2, Loader2 } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profileStore'
import { createProfile, deleteProfile } from '@/api/profiles'
import { Button } from '@/components/ui/button'

import AddProfileModal from '@/components/AddProfileModal.vue'
import DeleteProfileModal from '@/components/DeleteProfileModal.vue'

const store = useProfileStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const deletingProfile = ref<any>(null)

const isFetchingMore = ref(false)
const allLoaded = ref(false)
const perPage = 10 // Увеличим для удобства

// Следим за активным профилем из стора, чтобы данные всегда были актуальны
const activeProfileId = ref(store.activeProfile)
watch(() => store.activeProfile, (newId) => {
  activeProfileId.value = newId
})

function selectProfile(id: string) {
  store.setActiveProfile(id)
}

function openDeleteModal(profile: any) {
  deletingProfile.value = profile
  showDeleteModal.value = true
}

async function loadProfiles(append = false) {
  if (allLoaded.value && append) return

  const currentPage = append ? Math.ceil(store.profiles.length / perPage) + 1 : 1
  
  const result = await store.fetchProfiles({ 
    page: currentPage, 
    perPage: perPage,
    append: append 
  })

  if (result && result.length < perPage) {
    allLoaded.value = true
  }
}

async function handleScroll(event: Event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    if (!store.loading && !isFetchingMore.value && !allLoaded.value) {
      isFetchingMore.value = true
      await loadProfiles(true)
      isFetchingMore.value = false
    }
  }
}

async function confirmDelete() {
  if (!deletingProfile.value) return
  await deleteProfile(deletingProfile.value.id)
  allLoaded.value = false 
  await loadProfiles(false)
  showDeleteModal.value = false
}

async function handleAdd(data: { title: string }) {
  await createProfile(data.title)
  allLoaded.value = false
  await loadProfiles(false)
  showAddModal.value = false
}

onMounted(() => {
  loadProfiles(false)
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="store.loading && store.profiles.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-[72px] w-full bg-muted animate-pulse rounded-2xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div 
        @scroll="handleScroll"
        class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar transition-all px-1"
      >
        <div 
          v-for="(p, index) in store.profiles" 
          :key="p.id"
          @click="selectProfile(p.id)"
          :class="[
            'flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] mb-1',
            p.id === activeProfileId 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-border bg-card/40'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center">
              <CheckCircle2 
                v-if="p.id === activeProfileId" 
                class="w-5 h-5 text-primary animate-in zoom-in duration-300" 
              />
              <div v-else class="w-5 h-5 rounded-full border-2 border-muted"></div>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-sm leading-none">{{ p.title }}</span>
              <span v-if="index === 0" class="text-[9px] text-muted-foreground uppercase font-black mt-1 opacity-50 tracking-wider">Default</span>
            </div>
          </div>

          <Button
            v-if="index !== 0"
            variant="ghost"
            size="icon"
            class="h-9 w-9 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
            @click.stop="openDeleteModal(p)"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>

        <div v-if="isFetchingMore" class="flex justify-center py-4">
          <Loader2 class="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>

      <Button 
        variant="outline" 
        class="w-full h-14 border-dashed border-2 gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-all rounded-2xl mt-2 font-bold"
        @click="showAddModal = true"
      >
        <Plus class="w-4 h-4" />
        Create New Profile
      </Button>
    </div>

    <AddProfileModal :show="showAddModal" @close="showAddModal = false" @created="handleAdd" />
    <DeleteProfileModal :show="showDeleteModal" :profile-title="deletingProfile?.title" @close="showDeleteModal = false" @confirm="confirmDelete" />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>