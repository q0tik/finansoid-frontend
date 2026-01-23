<script setup>
import { ref } from 'vue'
import { X, UserPlus, Loader2, Link as LinkIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ 
  show: Boolean,
  title: { type: String, default: 'Add User' },
  label: { type: String, default: 'Entity ID' },
  placeholder: { type: String, default: 'UUID...' },
  buttonText: { type: String, default: 'Invite' },
  icon: { type: Object, default: UserPlus } // Можно передать другую иконку
})

const emit = defineEmits(['close', 'submit'])

const targetId = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!targetId.value) return
  loading.value = true
  
  // Передаем значение в родителя. 
  // Родитель сам решит, какой API вызвать (addUserToProfile или addProfileToAccount)
  emit('submit', targetId.value, () => {
    targetId.value = ''
    loading.value = false
  })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="emit('close')">
      <div class="w-full max-w-[350px] bg-card border border-border rounded-[28px] p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 text-primary rounded-xl">
              <component :is="icon" class="w-5 h-5" />
            </div>
            <h3 class="font-black italic text-lg text-foreground">{{ title }}</h3>
          </div>
          <button @click="emit('close')" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{{ label }}</label>
            <input 
              v-model="targetId"
              type="text"
              :placeholder="placeholder"
              @keyup.enter="handleSubmit"
              class="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <Button 
            class="w-full h-12 rounded-xl font-black uppercase tracking-widest gap-2"
            :disabled="!targetId || loading"
            @click="handleSubmit"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span v-else>{{ buttonText }}</span>
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>