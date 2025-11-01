<!-- src/components/layout/MobileDrawer.vue -->
<template>
    <transition name="slide">
        <div
            v-if="open"
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex"
            @click.self="close"
        >
            <div class="w-[78%] bg-surface h-full p-5 rounded-tr-2xl rounded-br-2xl shadow-soft flex flex-col">
                <div class="flex items-center justify-between mb-6">
                    <div class="font-semibold text-lg flex items-center gap-2">
                        💸 <span>Finansoid</span>
                    </div>
                    <a-button type="text" @click="close">✕</a-button>
                </div>

                <nav class="flex flex-col gap-3 text-neutral-700 text-[15px]">
                    <RouterLink v-for="item in items" :key="item.to"
                        :to="item.to"
                        class="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-muted"
                        :class="{ 'bg-primary text-white': route.path === item.to }"
                        @click="close"
                    >
                        <span class="text-lg">{{ item.icon }}</span>
                        <span>{{ item.label }}</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { useRoute } from "vue-router";

defineProps({
    open: Boolean,
});
const emit = defineEmits(["close"]);
const close = () => emit("close");

const route = useRoute();

const items = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/quick-expense", label: "Quick Expense", icon: "➕" },
    { to: "/transactions", label: "Transactions", icon: "📄" },
    { to: "/accounts", label: "Accounts", icon: "💳" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
];
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.25s ease;
}
.slide-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}
.slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>
