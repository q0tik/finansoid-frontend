<template>
    <a-card
        title="Dashboard"
        :bordered="false"
        class="md:shadow md:rounded-lg"
        :bodyStyle="{ padding: isMobile ? '12px' : '20px' }"
    >
        <p class="text-neutral-700">Quick stats will be here.</p>

        <div class="mt-3 md:mt-4 bg-blue-500 text-white p-3 md:p-4 rounded-lg shadow">
            Tailwind работает 🚀
        </div>
    </a-card>
</template>

<script setup>
import { useIsMobile } from "@/composables/useIsMobile";
const { isMobile } = useIsMobile();
</script>
