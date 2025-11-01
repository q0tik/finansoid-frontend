<template>
    <header
        class="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-neutral-100 px-5 py-3 flex justify-center items-center"
    >
        <div class="flex items-center gap-2 text-lg font-semibold">
            <Sparkles class="w-5 h-5 text-accent" />
            <span>Finansoid</span>
        </div>
    </header>
</template>

<script setup>
import { Sparkles } from "lucide-vue-next";
</script>