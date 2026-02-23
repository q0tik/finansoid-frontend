<script setup>
import { useI18n } from 'vue-i18n'
import { Check } from 'lucide-vue-next'

const { locale } = useI18n()

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'ka', flag: '🇬🇪', name: 'ქართული' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
]

function setLanguage(code) {
  locale.value = code
  localStorage.setItem('lang', code)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3 p-1">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="setLanguage(lang.code)"
      class="relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-95"
      :class="[
        locale === lang.code
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/30'
      ]"
    >
      <span class="text-xl leading-none">{{ lang.flag }}</span>
      <span class="text-sm font-medium flex-1 text-left">{{ lang.name }}</span>
      <Check v-if="locale === lang.code" class="w-4 h-4 text-primary shrink-0" />
    </button>
  </div>
</template>
