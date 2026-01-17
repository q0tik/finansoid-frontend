<script setup>
import { ref, watch, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ show: Boolean })
const emits = defineEmits(['close', 'created'])

const title = ref('')

function handleSubmit() {
  if (!title.value.trim()) return
  emits('created', { title: title.value.trim() })
  title.value = ''
  emits('close')
}

watch(() => props.show, (open) => {
  if (open) nextTick(() => document.getElementById('profile-title')?.focus())
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4"
      @click.self="emits('close')"
    >
      <div class="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold tracking-tight">Add profile</h2>
          <button @click="emits('close')" class="p-1 hover:bg-muted rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-2">
            <label for="profile-title" class="text-sm font-medium ml-1">Profile Name</label>
            <input
              id="profile-title"
              v-model="title"
              type="text"
              class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g. Personal, Work..."
            />
          </div>

          <Button type="submit" class="w-full h-12 text-base rounded-xl shadow-md">
            Create Profile
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>