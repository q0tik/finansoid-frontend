<script setup>
import { ref, watch, nextTick } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ show: Boolean, title: String })
const emits = defineEmits(['close', 'confirm'])
const confirmText = ref('')

watch(() => props.show, (open) => {
  if (open) {
    confirmText.value = ''
    nextTick(() => document.getElementById('del-acc-confirm')?.focus())
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4" @click.self="emits('close')">
      <div class="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200">
        <div class="flex items-center gap-2 text-destructive mb-4">
          <AlertTriangle class="w-5 h-5" />
          <h2 class="text-lg font-bold">Delete Account?</h2>
        </div>

        <p class="text-sm text-muted-foreground mb-6">
          This will delete all transactions linked to <b>{{ title }}</b>. Type the name to confirm:
        </p>

        <div class="space-y-4">
          <input id="del-acc-confirm" v-model="confirmText" type="text" class="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-destructive/20" :placeholder="title" />
          <Button variant="destructive" class="w-full h-12 rounded-xl" :disabled="confirmText !== title" @click="emits('confirm')">
            Confirm Deletion
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>