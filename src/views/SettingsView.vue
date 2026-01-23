<script setup>
import { ref } from 'vue'
import { Palette, CreditCard, MessageSquarePlus, Languages } from 'lucide-vue-next'
import UserHeader from '@/components/settings/UserHeader.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import FeedbackForm from '@/components/settings/FeedbackForm.vue'
import ThemeSelector from '@/components/settings/ThemeSelector.vue'

const openSection = ref(null)
const currentTheme = ref(localStorage.getItem('user-theme') || 'light')
</script>

<template>
  <div class="h-full overflow-y-auto bg-background p-4 pb-28 space-y-4 flex flex-col">
    
    <UserHeader />

    <div class="space-y-3">
      <SettingsCard 
        title="Appearance" 
        :icon="Palette" 
        icon-class="bg-purple-500/10 text-purple-500"
        :is-open="openSection === 'theme'"
        @toggle="openSection = openSection === 'theme' ? null : 'theme'"
      >
        <ThemeSelector v-model="currentTheme" :themes="['light', 'dark', 'mint', 'desert', 'frost']" />
      </SettingsCard>

      <SettingsCard 
        title="Feedback" 
        :icon="MessageSquarePlus" 
        icon-class="bg-emerald-500/10 text-emerald-500"
        :is-open="openSection === 'feedback'"
        @toggle="openSection = openSection === 'feedback' ? null : 'feedback'"
      >
        <FeedbackForm />
      </SettingsCard>

      <div class="bg-card/40 border border-border rounded-[28px] p-4 flex justify-between items-center opacity-40 grayscale">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-muted rounded-xl"><Languages class="w-5 h-5" /></div>
          <span class="font-bold">Language</span>
        </div>
        <span class="text-[9px] font-black bg-muted px-2 py-1 rounded-lg">SOON</span>
      </div>

      <div class="bg-card/40 border border-border rounded-[28px] p-4 flex justify-between items-center opacity-40 grayscale">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-muted rounded-xl"><CreditCard class="w-5 h-5" /></div>
          <span class="font-bold">Subscription</span>
        </div>
        <span class="text-[9px] font-black bg-muted px-2 py-1 rounded-lg">SOON</span>
      </div>
    </div>

    <a 
      href="https://quottech.t.me" 
      target="_blank"
      class="flex items-center justify-center gap-2 mt-10 p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-[28px] transition-all active:scale-[0.98] group"
    >
      <div class="p-1.5 bg-primary/10 text-primary rounded-lg">
        <MessageSquarePlus class="w-4 h-4" />
      </div>
      <span class="font-black italic uppercase tracking-widest text-[11px] text-primary">Contact Support</span>
    </a>

    <div class="mt-auto py-6 text-center">
      <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">Version 0.7.3 (BETA)</p>
    </div>
  </div>
</template>