<script setup>
import { ref } from 'vue'
import { Palette, Users, MessageSquarePlus, Languages } from 'lucide-vue-next'
import UserHeader from '@/components/settings/UserHeader.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import FeedbackForm from '@/components/settings/FeedbackForm.vue'
import ThemeSelector from '@/components/settings/ThemeSelector.vue'

const openSection = ref('theme')
const currentTheme = ref(localStorage.getItem('user-theme') || 'light')
</script>

<template>
  <div class="h-full overflow-y-auto bg-background p-4 pb-24 space-y-4 flex flex-col">
    
    <UserHeader />

    <div class="space-y-3">
      <SettingsCard 
        title="Appearance" 
        :icon="Palette" 
        icon-class="bg-purple-500/10 text-purple-500"
        :is-open="openSection === 'theme'"
        @toggle="openSection = openSection === 'theme' ? null : 'theme'"
      >
        <ThemeSelector v-model="currentTheme" :themes="['light', 'dark', 'mint', 'desert']" />
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
    </div>

    <div class="mt-auto py-6 text-center">
      <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">Version 1.2.0</p>
    </div>
  </div>
</template>