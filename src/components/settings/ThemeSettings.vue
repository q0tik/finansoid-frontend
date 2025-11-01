<template>
    <div class="space-y-4">
        <p class="text-sm text-neutral-600 mb-2">Select application theme:</p>

        <div class="grid grid-cols-2 gap-3">
            <button
                v-for="theme in themes"
                :key="theme.value"
                @click="setTheme(theme.value)"
                class="py-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition
                       hover:shadow-md hover:-translate-y-[1px]"
                :class="[
                    currentTheme === theme.value
                        ? 'border-blue-500 ring-2 ring-blue-300'
                        : 'border-neutral-300 bg-white'
                ]"
            >
                <div :class="['w-8 h-8 rounded-full', theme.preview]"></div>
                <span class="text-xs font-medium">{{ theme.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Выбранная тема
const currentTheme = ref(localStorage.getItem("theme") || "light");

// Быстрый список тем
const themes = [
    { value: "light", label: "Light", preview: "bg-white border border-neutral-300" },
    { value: "dark", label: "Dark", preview: "bg-neutral-800" },
    { value: "mint", label: "Mint Frost", preview: "bg-gradient-to-br from-cyan-100 to-teal-200" },
    { value: "desert", label: "Desert Sand", preview: "bg-gradient-to-br from-yellow-100 to-orange-200" },
];

function setTheme(value) {
    currentTheme.value = value;
}

// Как только тема меняется → применяем к <html data-theme="">
watch(currentTheme, (value) => {
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute("data-theme", value);
}, { immediate: true });
</script>
