<script setup>
import { ref } from 'vue'
import { Palette, CreditCard, MessageSquarePlus, Languages } from 'lucide-vue-next'
import UserHeader from '@/features/settings/components/UserHeader.vue'
import SettingsCard from '@/features/settings/components/SettingsCard.vue'
import FeedbackForm from '@/features/settings/components/FeedbackForm.vue'
import ThemeSelector from '@/features/settings/components/ThemeSelector.vue'
import LanguageSelector from '@/features/settings/components/LanguageSelector.vue'

const openSection = ref(null)
const currentTheme = ref(localStorage.getItem('user-theme') || 'light')

const version = ref("0.8.8-δ")
</script>

<template>
  <div class="h-full overflow-y-auto bg-background p-4 pb-28 space-y-4 flex flex-col">

    <UserHeader />

    <div class="space-y-3">
      <SettingsCard
        :title="$t('settings.appearance')"
        :icon="Palette"
        icon-class="bg-purple-500/10 text-purple-500"
        :is-open="openSection === 'theme'"
        @toggle="openSection = openSection === 'theme' ? null : 'theme'"
      >
        <ThemeSelector v-model="currentTheme" :themes="['light', 'dark', 'mint', 'desert', 'frost']" />
      </SettingsCard>

      <SettingsCard
        :title="$t('settings.language')"
        :icon="Languages"
        icon-class="bg-blue-500/10 text-blue-500"
        :is-open="openSection === 'language'"
        @toggle="openSection = openSection === 'language' ? null : 'language'"
      >
        <LanguageSelector />
      </SettingsCard>

      <SettingsCard
        :title="$t('settings.feedback')"
        :icon="MessageSquarePlus"
        icon-class="bg-emerald-500/10 text-emerald-500"
        :is-open="openSection === 'feedback'"
        @toggle="openSection = openSection === 'feedback' ? null : 'feedback'"
      >
        <FeedbackForm />
      </SettingsCard>

      <div class="bg-card/40 border border-border rounded-[28px] p-4 flex justify-between items-center opacity-40 grayscale">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-muted rounded-xl"><CreditCard class="w-5 h-5" /></div>
          <span class="font-bold">{{ $t('settings.subscription') }}</span>
        </div>
        <span class="text-[9px] font-black bg-muted px-2 py-1 rounded-lg">{{ $t('common.soon') }}</span>
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
      <span class="font-black italic uppercase tracking-widest text-[11px] text-primary">{{ $t('settings.contact_support') }}</span>
    </a>

    <div class="mt-auto py-6 text-center">
      <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">{{ $t('settings.version') }} {{ version }}</p>
    </div>
  </div>
</template>
